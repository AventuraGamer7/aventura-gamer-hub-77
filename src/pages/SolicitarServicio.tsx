import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEO/SEOHead';
import { 
  Wrench, 
  Camera, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Loader2,
  X,
  Smartphone
} from 'lucide-react';

const ADMIN_ID = 'b9f7ef0d-7ef6-4be9-8e53-8548ae9fadb2';

const SolicitarServicio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    dispositivo: location.state?.servicio_nombre || '',
    descripcion: location.state?.descripcion_sugerida || ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 2) {
        toast({
          title: "Límite superado",
          description: "Solo puedes subir un máximo de 2 fotos.",
          variant: "destructive"
        });
        return;
      }
      
      const newImages = [...images, ...selectedFiles];
      setImages(newImages);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (numero_orden: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      const timestamp = Math.floor(Date.now() / 1000);
      const fileName = `${timestamp}_${image.name.replace(/\s+/g, '_')}`;
      const path = `ordenes/${numero_orden}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(path, image);
        
      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(path);
        
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Crear registro inicial para obtener numero_orden
      // Supuesta lógica de BD autogenera numero_orden si es null o por trigger?
      // El prompt dice "Mostrar mensaje de confirmación con el número de orden generado"
      // Insertamos con los datos básicos
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .insert({
          usuario_id: ADMIN_ID,
          cliente_nombre: formData.cliente_nombre,
          cliente_telefono: formData.cliente_telefono,
          dispositivo: formData.dispositivo,
          descripcion: formData.descripcion,
          estado: 'Recibido'
        })
        .select('id, numero_orden')
        .single();
        
      if (error) throw error;
      
      const actualOrderNumber = data.numero_orden || `OS-${data.id.slice(0, 8)}`;
      
      // 2. Subir imágenes si existen
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(actualOrderNumber);
        
        // 3. Actualizar con las URLs de las imágenes
        await supabase
          .from('ordenes_servicio')
          .update({ imagenes_entrada: imageUrls })
          .eq('id', data.id);
      }
      
      setOrderNumber(actualOrderNumber);
      setSubmitted(true);
      toast({
        title: "¡Solicitud enviada!",
        description: "Tu orden de servicio ha sido creada correctamente.",
      });
      
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error al enviar",
        description: error.message || "Ocurrió un problema al crear tu solicitud.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const waLink = `https://wa.me/573244471353?text=${encodeURIComponent(`Hola, hice una solicitud de servicio, mi número de orden es ${orderNumber}`)}`;
    
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
          <Card className="card-gaming w-full max-w-lg border-green-500/30">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-orbitron text-glow text-green-400">¡Solicitud Exitosa!</CardTitle>
                <CardDescription className="text-xl font-rajdhani">
                  Tu número de orden es: <span className="text-white font-bold">{orderNumber}</span>
                </CardDescription>
              </div>
              <p className="text-muted-foreground font-rajdhani">
                Hemos recibido tu solicitud. Para agilizar el proceso, por favor contáctanos vía WhatsApp para coordinar la recepción o envío del equipo.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <Button 
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white font-bold h-14"
                >
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contactar por WhatsApp
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/servicios')}
                  className="font-rajdhani"
                >
                  Volver a servicios
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Solicitar Servicio Técnico - Aventura Gamer"
        description="Solicita reparación o mantenimiento para tu consola o equipo gamer."
      />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-orbitron text-glow text-cyan-400">
              Solicitar Orden de Servicio
            </h1>
            <p className="text-muted-foreground font-rajdhani">
              Completa el formulario para iniciar tu proceso de reparación. No necesitas estar registrado.
            </p>
          </div>

          <Card className="card-gaming border-primary/20">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg">Datos de la Solicitud</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cliente_nombre">Nombre completo *</Label>
                    <Input 
                      id="cliente_nombre" 
                      placeholder="Ej: Juan Pérez" 
                      required 
                      value={formData.cliente_nombre}
                      onChange={handleInputChange}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cliente_telefono">Teléfono WhatsApp *</Label>
                    <Input 
                      id="cliente_telefono" 
                      placeholder="Ej: 3001234567" 
                      required 
                      value={formData.cliente_telefono}
                      onChange={handleInputChange}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispositivo" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Dispositivo *
                  </Label>
                  <Input 
                    id="dispositivo" 
                    placeholder="Ej: PS4 Fat 500GB, Joy-Con Nintendo Switch" 
                    required 
                    value={formData.dispositivo}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del problema *</Label>
                  <Textarea 
                    id="descripcion" 
                    placeholder="Describe detalladamente qué le sucede a tu equipo..." 
                    required 
                    rows={4}
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Fotos del dispositivo (opcional - Máx 2)</Label>
                  <div className="flex flex-wrap gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-primary/30">
                        <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 rounded-full p-1 shadow-lg"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 2 && (
                      <label 
                        className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                      >
                        <Camera className="h-8 w-8 text-primary/60" />
                        <span className="text-[10px] text-primary/60 mt-2 font-bold uppercase">Subir</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-gaming h-12"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando solicitud...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SolicitarServicio;
