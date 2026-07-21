// One-shot resizer for legacy Supabase raw images.
// Downloads each raw JPG/PNG from product-images, resizes to 640px wide JPEG q75,
// uploads as <path>_r640.jpg, and updates products.image / products.images.
//
// Auth: requires header `x-admin-key` matching REGEN_ADMIN_KEY secret.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Image } from "https://deno.land/x/imagescript@1.2.17/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_KEY = Deno.env.get("REGEN_ADMIN_KEY") ?? "";
const BUCKET = "product-images";
const TARGET_W = 640;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

function extractPath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return null;
  return url.substring(i + marker.length);
}

async function processOne(url: string): Promise<{ url: string; newUrl?: string; skipped?: string; error?: string; savedBytes?: number }> {
  const path = extractPath(url);
  if (!path) return { url, skipped: "not-supabase" };
  if (!/\.(jpg|jpeg|png)$/i.test(path)) return { url, skipped: "not-raw" };
  if (path.includes("_r640.")) return { url, skipped: "already-resized" };

  try {
    const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(path);
    if (dlErr || !blob) return { url, error: `download: ${dlErr?.message}` };
    const origBytes = blob.size;
    // imagescript OOMs the edge worker on >3MB source images. Skip those; they need client-side handling.
    if (origBytes > 3 * 1024 * 1024) return { url, skipped: `too-large (${origBytes})` };
    const buf = new Uint8Array(await blob.arrayBuffer());

    const img = await Image.decode(buf);
    if (img.width <= TARGET_W) {
      // Still re-encode as JPEG q75 to shrink PNGs / oversized-quality JPEGs
    }
    const scale = Math.min(1, TARGET_W / img.width);
    if (scale < 1) img.resize(Math.round(img.width * scale), Math.round(img.height * scale));
    const outBuf = await img.encodeJPEG(75);

    if (outBuf.byteLength >= origBytes * 0.9) {
      // Not worth: save less than 10%. Skip to avoid pointless writes.
      return { url, skipped: `no-gain (${origBytes} → ${outBuf.byteLength})` };
    }

    const newPath = path.replace(/\.(jpg|jpeg|png)$/i, "_r640.jpg");
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(newPath, outBuf, {
      contentType: "image/jpeg",
      cacheControl: "31536000, immutable",
      upsert: true,
    });
    if (upErr) return { url, error: `upload: ${upErr.message}` };

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(newPath);
    return { url, newUrl: pub.publicUrl, savedBytes: origBytes - outBuf.byteLength };
  } catch (e) {
    return { url, error: (e as Error).message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (ADMIN_KEY && req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "10"), 50);
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? "0"));

  // Collect candidates from products.image and products.images
  const { data: products, error } = await supabase
    .from("products")
    .select("id, image, images")
    .or("image.like.%supabase.co/storage/v1/object/public/product-images/%,images.cs.{}");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  type Cand = { productId: string; field: "image" | "images"; index?: number; url: string };
  const candidates: Cand[] = [];
  for (const p of products ?? []) {
    if (p.image && /supabase\.co\/storage\/v1\/object\/public\/product-images\/.+\.(jpg|jpeg|png)$/i.test(p.image) && !p.image.includes("_r640.")) {
      candidates.push({ productId: p.id, field: "image", url: p.image });
    }
    if (Array.isArray(p.images)) {
      p.images.forEach((u: string, i: number) => {
        if (u && /supabase\.co\/storage\/v1\/object\/public\/product-images\/.+\.(jpg|jpeg|png)$/i.test(u) && !u.includes("_r640.")) {
          candidates.push({ productId: p.id, field: "images", index: i, url: u });
        }
      });
    }
  }

  if (dryRun) {
    return new Response(JSON.stringify({ total: candidates.length, sample: candidates.slice(0, 10) }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const batch = candidates.slice(offset, offset + limit);
  const results: any[] = [];
  let totalSaved = 0;

  for (const c of batch) {
    const r = await processOne(c.url);
    results.push({ ...c, ...r });
    if (r.savedBytes) totalSaved += r.savedBytes;

    if (r.newUrl) {
      if (c.field === "image") {
        await supabase.from("products").update({ image: r.newUrl }).eq("id", c.productId);
      } else if (c.field === "images" && typeof c.index === "number") {
        const { data: fresh } = await supabase.from("products").select("images").eq("id", c.productId).single();
        if (fresh?.images && Array.isArray(fresh.images)) {
          const next = [...fresh.images];
          next[c.index] = r.newUrl;
          await supabase.from("products").update({ images: next }).eq("id", c.productId);
        }
      }
    }
  }

  return new Response(JSON.stringify({
    processed: batch.length,
    remaining: candidates.length - batch.length,
    savedBytes: totalSaved,
    savedHuman: `${(totalSaved / 1024 / 1024).toFixed(2)} MB`,
    results,
  }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
