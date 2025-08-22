import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('¡Hola! Soy un aventurero y quiero más información sobre un servicio.');
    window.open(`https://wa.me/573505138557?text=${message}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* WhatsApp Button */}
        <Button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-700 ease-out transform hover:-translate-y-2 hover:scale-105 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {/* Close Button */}
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 bg-background border border-border rounded-full shadow-sm hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-background border border-border rounded-lg p-3 shadow-lg min-w-[200px] transform translate-x-1/4">
          <div className="text-sm font-medium text-foreground mb-1">
            ¿Necesitas ayuda?
          </div>
          <div className="text-xs text-muted-foreground">
            Chatea con nuestros aventureros expertos
          </div>
          {/* Arrow */}
          <div className="absolute top-full right-6 transform -translate-x-1/2">
            <div className="border-4 border-transparent border-t-border"></div>
            <div className="border-4 border-transparent border-t-background absolute top-[-5px] left-[-4px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppFloat;