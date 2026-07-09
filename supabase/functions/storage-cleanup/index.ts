// Storage cleanup one-shot function.
// - Deletes orphan files in product-images (__original, __large, __thumb, legacy sans-suffix, orphan __medium)
// - Migrates in-use files from `imagenes` -> `product-images` (updates DB URLs)
// - Migrates all files from `product images` -> `product-images` (updates DB URLs)
// - Deletes remaining files in `imagenes` and `product images`
//
// POST body: { dryRun?: boolean, actions?: string[] }
// actions: ["orphans", "migrate-imagenes", "migrate-duplicate"] (default: all)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

async function listAll(bucket: string): Promise<{ name: string; size: number }[]> {
  const out: { name: string; size: number }[] = [];
  const walk = async (prefix: string) => {
    let offset = 0;
    while (true) {
      const { data, error } = await admin.storage.from(bucket).list(prefix, {
        limit: 1000,
        offset,
        sortBy: { column: "name", order: "asc" },
      });
      if (error) throw error;
      if (!data || data.length === 0) break;
      for (const item of data) {
        const path = prefix ? `${prefix}/${item.name}` : item.name;
        if (item.id === null) {
          // folder
          await walk(path);
        } else {
          out.push({ name: path, size: (item.metadata as any)?.size ?? 0 });
        }
      }
      if (data.length < 1000) break;
      offset += 1000;
    }
  };
  await walk("");
  return out;
}

async function getReferencedUrls(): Promise<Set<string>> {
  const refs = new Set<string>();
  const add = (v: unknown) => {
    if (typeof v === "string" && v.length > 0) refs.add(v);
    else if (Array.isArray(v)) for (const x of v) if (typeof x === "string") refs.add(x);
  };

  const pageSize = 1000;
  // products.image + products.images
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await admin
      .from("products")
      .select("image, images")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const r of data) { add(r.image); add(r.images); }
    if (data.length < pageSize) break;
  }
  // product_images.image_url
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await admin
      .from("product_images")
      .select("image_url")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const r of data) add(r.image_url);
    if (data.length < pageSize) break;
  }
  // media_library.url
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await admin
      .from("media_library")
      .select("url")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const r of data) add(r.url);
    if (data.length < pageSize) break;
  }
  // hero_slides / courses / services may hold images too — best-effort
  for (const t of ["hero_slides", "courses", "services"] as const) {
    try {
      const { data } = await admin.from(t).select("*").limit(2000);
      if (data) {
        for (const row of data) {
          for (const v of Object.values(row)) add(v as any);
        }
      }
    } catch { /* ignore */ }
  }
  return refs;
}

function publicUrl(bucket: string, path: string): string {
  return admin.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function updateUrlEverywhere(oldUrl: string, newUrl: string) {
  // products.image
  await admin.from("products").update({ image: newUrl }).eq("image", oldUrl);
  // product_images.image_url
  await admin.from("product_images").update({ image_url: newUrl }).eq("image_url", oldUrl);
  // media_library.url
  await admin.from("media_library").update({ url: newUrl }).eq("url", oldUrl);
  // products.images (array) — fetch and rewrite
  const { data: prods } = await admin
    .from("products")
    .select("id, images")
    .contains("images", [oldUrl]);
  if (prods) {
    for (const p of prods) {
      const next = (p.images as string[]).map((u) => (u === oldUrl ? newUrl : u));
      await admin.from("products").update({ images: next }).eq("id", p.id);
    }
  }
}

async function removeBatch(bucket: string, paths: string[], dryRun: boolean) {
  if (dryRun || paths.length === 0) return 0;
  let removed = 0;
  const chunkSize = 100;
  for (let i = 0; i < paths.length; i += chunkSize) {
    const chunk = paths.slice(i, i + chunkSize);
    const { data, error } = await admin.storage.from(bucket).remove(chunk);
    if (error) throw error;
    removed += data?.length ?? 0;
  }
  return removed;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const dryRun: boolean = body.dryRun !== false;
    const actions: string[] = body.actions ?? ["orphans", "migrate-imagenes", "migrate-duplicate"];
    const limit: number = body.limit ?? 15;

    const report: any = { dryRun, actions, results: {} };

    const refs = await getReferencedUrls();
    report.referencedUrls = refs.size;

    // 1) Orphans in product-images
    if (actions.includes("orphans")) {
      const files = await listAll("product-images");
      const toDelete: string[] = [];
      let bytes = 0;
      for (const f of files) {
        const url = publicUrl("product-images", f.name);
        const isVariant =
          f.name.includes("__original") ||
          f.name.includes("__large") ||
          f.name.includes("__thumb") ||
          f.name.includes("__medium");
        // Keep only files whose URL is referenced in DB
        if (!refs.has(url)) {
          // extra safety: also compare bare filename referenced
          toDelete.push(f.name);
          bytes += f.size;
        }
      }
      const removed = await removeBatch("product-images", toDelete, dryRun);
      report.results.orphans = {
        totalFiles: files.length,
        deleteCount: toDelete.length,
        deleteBytes: bytes,
        removed,
        sample: toDelete.slice(0, 10),
      };
    }

    // 2) Migrate `imagenes` bucket -> product-images then delete bucket contents
    if (actions.includes("migrate-imagenes")) {
      const files = await listAll("imagenes");
      const migrated: string[] = [];
      const deleted: string[] = [];
      let migratedBytes = 0;
      let deletedBytes = 0;
      let processed = 0;
      for (const f of files) {
        if (processed >= limit) break;
        const oldUrl = publicUrl("imagenes", f.name);
        if (refs.has(oldUrl)) {
          if (!dryRun) {
            const { data: dl, error: dlErr } = await admin.storage.from("imagenes").download(f.name);
            if (dlErr || !dl) { continue; }
            const newPath = `migrated/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const { error: upErr } = await admin.storage.from("product-images").upload(newPath, dl, {
              cacheControl: "31536000, immutable",
              upsert: false,
              contentType: dl.type || "image/jpeg",
            });
            if (upErr) { continue; }
            const newUrl = publicUrl("product-images", newPath);
            await updateUrlEverywhere(oldUrl, newUrl);
            await admin.storage.from("imagenes").remove([f.name]);
          }
          migrated.push(f.name);
          migratedBytes += f.size;
          processed++;
        } else {
          if (!dryRun) await admin.storage.from("imagenes").remove([f.name]);
          deleted.push(f.name);
          deletedBytes += f.size;
          processed++;
        }
      }
      report.results["migrate-imagenes"] = {
        totalFiles: files.length,
        migratedCount: migrated.length,
        migratedBytes,
        deletedCount: deleted.length,
        deletedBytes,
      };
    }

    // 3) Migrate `product images` (duplicate with space) -> product-images
    if (actions.includes("migrate-duplicate")) {
      const files = await listAll("product images");
      const migrated: string[] = [];
      const deleted: string[] = [];
      for (const f of files) {
        const oldUrl = publicUrl("product images", f.name);
        if (refs.has(oldUrl)) {
          if (!dryRun) {
            const { data: dl } = await admin.storage.from("product images").download(f.name);
            if (dl) {
              const newPath = `migrated-dup/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
              await admin.storage.from("product-images").upload(newPath, dl, {
                cacheControl: "31536000, immutable",
                upsert: false,
                contentType: dl.type || "image/jpeg",
              });
              const newUrl = publicUrl("product-images", newPath);
              await updateUrlEverywhere(oldUrl, newUrl);
              await admin.storage.from("product images").remove([f.name]);
            }
          }
          migrated.push(f.name);
        } else {
          if (!dryRun) await admin.storage.from("product images").remove([f.name]);
          deleted.push(f.name);
        }
      }
      report.results["migrate-duplicate"] = {
        totalFiles: files.length,
        migratedCount: migrated.length,
        deletedCount: deleted.length,
      };
    }

    return new Response(JSON.stringify(report, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), stack: (e as Error).stack }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
