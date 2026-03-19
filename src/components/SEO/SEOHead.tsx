import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  structuredData?: object;
  noindex?: boolean;
  canonicalUrl?: string;
}

const SEOHead: React.FC<SEOProps> = ({
  title = 'Aventura Gamer - Reparación de Consolas y Cursos Gaming en Envigado',
  description = 'Expertos en reparación de PlayStation, Xbox y Nintendo en Envigado. Cursos especializados en tecnología gaming, repuestos originales y servicio técnico certificado. ✅ Garantía completa.',
  keywords = 'reparación PlayStation Envigado, reparación Xbox Envigado, reparación Nintendo Switch, cursos gaming Colombia, repuestos consolas Antioquia, servicio técnico gaming',
  image = '/og-aventura-gamer.jpg',
  url = 'https://aventuragamer.com',
  type = 'website',
  structuredData,
  noindex = false,
  canonicalUrl
}) => {
  const finalTitle = title.includes('Aventura Gamer') ? title : `${title} | Aventura Gamer`;
  const finalUrl = url || `${window.location.origin}${window.location.pathname}`;
  const finalCanonical = canonicalUrl || finalUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="author" content="Aventura Gamer" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="es-CO" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${title} - Aventura Gamer`} />
      <meta property="og:site_name" content="Aventura Gamer" />
      <meta property="og:locale" content="es_CO" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@aventuragamer777" />
      
      {/* WhatsApp Optimization */}
      <meta property="whatsapp:title" content={finalTitle} />
      <meta property="whatsapp:description" content={description} />
      <meta property="whatsapp:image" content={image} />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="CO-ANT" />
      <meta name="geo.placename" content="Envigado, Antioquia" />
      <meta name="geo.position" content="6.168065;-75.590470" />
      <meta name="ICBM" content="6.168065, -75.590470" />
      
      {/* Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Aventura Gamer",
          "description": "Centro especializado en reparación de consolas gaming y cursos técnicos en Envigado",
          "url": "https://aventuragamer.com",
          "telephone": "+573505138557",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle 36 Sur #41-36 Local 116",
            "addressLocality": "Envigado",
            "addressRegion": "Antioquia",
            "postalCode": "055420",
            "addressCountry": "CO"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 6.168065,
            "longitude": -75.590470
          },
          "openingHours": "Mo-Sa 09:00-19:00",
          "priceRange": "$$$",
          "servedCuisine": "Gaming Technology Services",
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 6.168065,
              "longitude": -75.590470
            },
            "geoRadius": "50000"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios Gaming",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Reparación PlayStation",
                  "description": "Servicio técnico especializado para consolas PlayStation"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Reparación Xbox",
                  "description": "Diagnóstico y reparación profesional para Xbox"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Cursos Gaming",
                  "description": "Formación técnica especializada en tecnología gaming"
                }
              }
            ]
          },
          "sameAs": [
            "https://www.instagram.com/aventuragamer777/",
            "https://www.youtube.com/@aventuragamer777"
          ]
        })}
      </script>
      
      {/* Additional Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;