// SEO utility functions
export const generateMetaTitle = (title: string, includeGaming = true): string => {
  const gamingTerms = includeGaming ? ' - Gaming en Envigado' : '';
  return title.includes('Aventura Gamer') 
    ? title 
    : `${title}${gamingTerms} | Aventura Gamer`;
};

export const generateServiceSchema = (service: {
  name: string;
  description: string;
  price: number;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "LocalBusiness",
    "name": "Aventura Gamer",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle 36 Sur #41-36 Local 116",
      "addressLocality": "Envigado",
      "addressRegion": "Antioquia",
      "addressCountry": "CO"
    }
  },
  "offers": {
    "@type": "Offer",
    "price": service.price,
    "priceCurrency": "COP",
    "availability": "https://schema.org/InStock"
  },
  "image": service.image,
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 6.168065,
      "longitude": -75.590470
    },
    "geoRadius": "50000"
  }
});

export const generateProductSchema = (product: {
  name: string;
  description: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "brand": product.brand || "Gaming",
  "category": product.category || "Gaming Accessories",
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "COP",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Aventura Gamer"
    }
  }
});

export const generateCourseSchema = (course: {
  title: string;
  description: string;
  price: number;
  cover?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.title,
  "description": course.description,
  "provider": {
    "@type": "Organization",
    "name": "Aventura Gamer",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle 36 Sur #41-36 Local 116",
      "addressLocality": "Envigado",
      "addressRegion": "Antioquia",
      "addressCountry": "CO"
    }
  },
  "offers": {
    "@type": "Offer",
    "price": course.price,
    "priceCurrency": "COP",
    "availability": "https://schema.org/InStock"
  },
  "image": course.cover
});

export const generateBreadcrumbSchema = (items: Array<{title: string, href?: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.title,
    "item": item.href ? `${window.location.origin}${item.href}` : undefined
  }))
});

export const localBusinessSchema = {
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
  "servedCuisine": "Gaming Technology Services"
};

export const getSEOKeywords = (category: string): string => {
  const keywordMap: Record<string, string> = {
    'servicios': 'reparación consolas Envigado, servicio técnico PlayStation Xbox Nintendo, diagnóstico gaming Antioquia',
    'productos': 'repuestos gaming originales, accesorios PlayStation Xbox, tienda gaming Envigado',
    'cursos': 'cursos reparación consolas, capacitación técnica gaming, certificación tecnología Colombia',
    'reparacion-playstation': 'reparación PlayStation 5 4 3 Envigado, arreglo consola Sony, servicio técnico PS5',
    'reparacion-xbox': 'reparación Xbox Series One 360 Envigado, servicio técnico Microsoft, arreglo consola Xbox',
    'reparacion-nintendo': 'reparación Nintendo Switch Envigado, arreglo Joy-Con, servicio técnico Nintendo',
    'contacto': 'contacto Aventura Gamer Envigado, ubicación taller gaming, teléfono reparación consolas'
  };
  
  return keywordMap[category] || 'gaming Envigado, reparación consolas, cursos gaming Colombia';
};