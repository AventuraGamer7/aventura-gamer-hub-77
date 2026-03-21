import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEO/SEOHead';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, FileText, Lock, Eye, Mail, MessageCircle } from 'lucide-react';

const Privacidad = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Política de Privacidad - Aventura Gamer"
        description="Conoce nuestra política de tratamiento de datos personales y privacidad según la ley de Habeas Data en Colombia."
      />
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-glow text-cyan-400">
            Política de Privacidad
          </h1>
          <p className="text-xl text-muted-foreground font-rajdhani">
            Tratamiento de Datos Personales
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-sm">
            <Lock className="h-4 w-4" />
            <span>Última actualización: {new Date().toLocaleDateString('es-CO')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          <Card className="bg-gray-900/50 border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-8 space-y-6 text-gray-300 font-rajdhani leading-relaxed text-lg">
              
              <section id="identificacion" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-orbitron text-white">1. Identificación del Responsable</h2>
                </div>
                <p>
                  En cumplimiento con lo establecido en la Ley Estatutaria 1581 de 2012 (Habeas Data) y el Decreto 1377 de 2013 de la República de Colombia, <strong>Aventura Gamer</strong> (en adelante "El Responsable"), con domicilio en Envigado, Antioquia, es responsable del tratamiento de los datos personales obtenidos a través de este sitio web, redes sociales (incluyendo WhatsApp) y en nuestra sede física.
                </p>
                <div className="bg-black/30 p-4 rounded-lg mt-4 border border-white/5 space-y-2 text-sm">
                  <p><strong>Ubicación:</strong> Calle 36 Sur #41-36, Local 116, Envigado, Colombia</p>
                  <p><strong>Teléfono / WhatsApp:</strong> +57 350 513 85 57</p>
                </div>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />

              <section id="recoleccion" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-secondary" />
                  <h2 className="text-2xl font-bold font-orbitron text-white">2. Datos Recolectados y Finalidad</h2>
                </div>
                <p>
                  Los datos personales que recolectamos directamente de nuestros clientes (nombre, teléfono, correo electrónico, dirección física e información sobre dispositivos en reparación o de interés) serán utilizados para las siguientes finalidades:
                </p>
                <ul className="list-none space-y-3 mt-4">
                  <li className="flex gap-3 items-start">
                    <span className="text-secondary font-bold mt-1">✓</span>
                    <span>Proveer de manera efectiva nuestros servicios técnicos, venta de productos y cursos.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-secondary font-bold mt-1">✓</span>
                    <span>Hacer seguimiento del estado de reparaciones y contactar al cliente sobre diagnósticos o entregas por teléfono o WhatsApp.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-secondary font-bold mt-1">✓</span>
                    <span>Diligenciar los procesos de envíos o domicilios para productos y reparaciones a nivel nacional y área metropolitana.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-secondary font-bold mt-1">✓</span>
                    <span>Gestionar el programa de gamificación (niveles y puntos de recompensa) asociado al perfil del usuario.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-secondary font-bold mt-1">✓</span>
                    <span>Enviar facturas, confirmaciones de orden e información publicitaria, si el usuario ha dado su consentimiento para ello.</span>
                  </li>
                </ul>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />

              <section id="derechos" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-orbitron text-white">3. Derechos de los Titulares</h2>
                </div>
                <p>
                  Como titular de sus datos personales, usted tiene derecho a:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-black/40 p-5 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                    <h3 className="font-bold text-white mb-2">Conocer, Actualizar y Rectificar</h3>
                    <p className="text-sm">Frente a datos parciales, inexactos, incompletos o fraccionados que induzcan a error.</p>
                  </div>
                  <div className="bg-black/40 p-5 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                    <h3 className="font-bold text-white mb-2">Solicitar Prueba de Autorización</h3>
                    <p className="text-sm">Requerir la prueba de que nos otorgó el permiso para tratar su información.</p>
                  </div>
                  <div className="bg-black/40 p-5 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                    <h3 className="font-bold text-white mb-2">Revocar o Suprimir</h3>
                    <p className="text-sm">Revocar la autorización o pedir la supresión del dato cuando no se respeten los principios constitucionales.</p>
                  </div>
                  <div className="bg-black/40 p-5 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                    <h3 className="font-bold text-white mb-2">Acceso Gratuito</h3>
                    <p className="text-sm">Acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento.</p>
                  </div>
                </div>
              </section>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />

              <section id="seguridad" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-gaming-orange" />
                  <h2 className="text-2xl font-bold font-orbitron text-white">4. Seguridad de la Información</h2>
                </div>
                <p>
                  Aventura Gamer cuenta con protocolos de seguridad en nuestra plataforma web (Suscripciones Seguras y Base de Datos) para evitar el acceso no autorizado, el rastreo o la filtración de sus datos personales. Las credenciales de pago o tarjetas de crédito son manejadas exclusivamente por los portales de pasarela de pago y <strong>nunca se almacenan en nuestros servidores</strong>.
                </p>
              </section>
              
              <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-8" />

              <section id="contacto" className="scroll-mt-24 space-y-4 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                  <h2 className="text-2xl font-bold font-orbitron text-white">5. Peticiones, Quejas o Reclamos</h2>
                </div>
                <p>
                  Para ejercer sus derechos de Habeas Data, o para cualquier inquietud relacionada con nuestra política de tratamiento de datos personales, puede escribirnos directamente a:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-white">soporte@aventuragamer.com</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-500/10 px-4 py-3 rounded-lg border border-green-500/30">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-400">WhatsApp: 350 513 85 57</span>
                  </div>
                </div>
              </section>

            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground pt-4 pb-8">
            © {new Date().getFullYear()} Aventura Gamer. Todos los derechos reservados. <br/>
            Este documento constituye un acuerdo legal vinculante entre el usuario y Aventura Gamer.
          </p>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacidad;
