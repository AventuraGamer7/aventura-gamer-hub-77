import React, { useEffect, useState } from 'react';

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

const Sitemap: React.FC = () => {
  const [sitemapXML, setSitemapXML] = useState<string>('');

  useEffect(() => {
    const generateSitemap = () => {
      const baseUrl = 'https://aventuragamer.com';
      const currentDate = new Date().toISOString();

      const urls: SitemapEntry[] = [
        { url: '', lastModified: currentDate, changeFreq: 'daily', priority: '1.0' },
        { url: '/servicios', lastModified: currentDate, changeFreq: 'weekly', priority: '0.9' },
        { url: '/servicios/reparacion-playstation', lastModified: currentDate, changeFreq: 'monthly', priority: '0.8' },
        { url: '/servicios/reparacion-xbox', lastModified: currentDate, changeFreq: 'monthly', priority: '0.8' },
        { url: '/servicios/reparacion-nintendo', lastModified: currentDate, changeFreq: 'monthly', priority: '0.8' },
        { url: '/tienda', lastModified: currentDate, changeFreq: 'daily', priority: '0.8' },
        { url: '/cursos', lastModified: currentDate, changeFreq: 'weekly', priority: '0.8' },
        { url: '/contacto', lastModified: currentDate, changeFreq: 'monthly', priority: '0.7' },
        { url: '/blog', lastModified: currentDate, changeFreq: 'weekly', priority: '0.6' },
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(entry => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      setSitemapXML(xml);
    };

    generateSitemap();
  }, []);

  // Set content type for XML
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