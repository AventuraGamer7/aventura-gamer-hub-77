import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageSEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const usePageSEO = (config: PageSEOConfig) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    document.title = config.title.includes('Aventura Gamer') 
      ? config.title 
      : `${config.title} | Aventura Gamer`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    }

    // Update keywords
    if (config.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords);
      }
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const currentUrl = `${window.location.origin}${location.pathname}`;
    const canonicalUrl = config.canonicalUrl || currentUrl;
    
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      const newCanonical = document.createElement('link');
      newCanonical.rel = 'canonical';
      newCanonical.href = canonicalUrl;
      document.head.appendChild(newCanonical);
    }

    // Add structured data
    if (config.structuredData) {
      const existingScript = document.querySelector('#page-structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'page-structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(config.structuredData);
      document.head.appendChild(script);
    }

  }, [config, location.pathname]);
};

export default usePageSEO;