import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap: React.FC = () => {
  const [sitemapXML, setSitemapXML] = useState<string>('');

  useEffect(() => {
    const generateSitemap = async () => {
      const baseUrl = 'https://aventuragamer.com';
      const currentDate = new Date().toISOString();

      // Static pages
      const staticUrls = [
        { url: '', changeFreq: 'daily', priority: '1.0' },
        { url: '/servicios', changeFreq: 'weekly', priority: '0.9' },
        { url: '/servicios/reparacion-playstation', changeFreq: 'monthly', priority: '0.8' },
        { url: '/servicios/reparacion-xbox', changeFreq: 'monthly', priority: '0.8' },
        { url: '/servicios/reparacion-nintendo', changeFreq: 'monthly', priority: '0.8' },
        { url: '/tienda', changeFreq: 'daily', priority: '0.8' },
        { url: '/cursos', changeFreq: 'weekly', priority: '0.8' },
        { url: '/contacto', changeFreq: 'monthly', priority: '0.7' },
        { url: '/blog', changeFreq: 'weekly', priority: '0.6' },
      ];

      // Fetch products with slugs
      let productUrls: { url: string; changeFreq: string; priority: string; lastmod: string }[] = [];
      try {
        const { data: products } = await supabase
          .from('products')
          .select('slug, category, platform, updated_at')
          .eq('active', true)
          .gt('stock', 0);

        if (products) {
          // Product detail pages
          productUrls = products
            .filter(p => p.slug)
            .map(p => ({
              url: `/producto/${p.slug}`,
              changeFreq: 'weekly',
              priority: '0.7',
              lastmod: p.updated_at || currentDate,
            }));

          // Category pages
          const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
          categories.forEach(cat => {
            staticUrls.push({
              url: `/tienda/${cat!.toLowerCase()}`,
              changeFreq: 'daily',
              priority: '0.7',
            });
          });

          // Platform pages
          const platforms = [...new Set(products.flatMap(p => p.platform || []).filter(Boolean))];
          platforms.forEach(plat => {
            staticUrls.push({
              url: `/tienda/todos/${plat.toLowerCase()}`,
              changeFreq: 'daily',
              priority: '0.6',
            });
          });
        }
      } catch (err) {
        console.error('Error fetching products for sitemap:', err);
      }

      const allUrls = [
        ...staticUrls.map(u => ({ ...u, lastmod: currentDate })),
        ...productUrls,
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(entry => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changeFreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      setSitemapXML(xml);
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    document.title = 'Sitemap - Aventura Gamer';
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', padding: '20px' }}>
      {sitemapXML}
    </div>
  );
};

export default Sitemap;
