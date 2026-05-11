import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Plus,
  Eye,
  Wrench,
  Phone,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Camera,
  Smartphone,
  Download
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ── Types ────────────────────────────────────────────────────────────────────
interface OrdenServicio {
  id: string;
  numero_orden: string | null;
  usuario_id: string;
  estado: 'Recibido' | 'En_Cotizacion' | 'Esperando_Aprobacion' | 'En_Reparacion' | 'completada' | 'Entregada';
  dispositivo: string | null;
  cliente_nombre: string | null;
  cliente_telefono: string | null;
  descripcion: string;
  notas_riesgo: string | null;
  precio_cotizacion: number | null;
  precio_servicio: number | null;
  trabajo_realizado: string | null;
  tecnico_nombre: string | null;
  imagenes_entrada: string[];
  admin_descripcion: string | null;
  admin_imagenes: string[];
  cotizacion_enviada: boolean;
  created_at: string;
  updated_at: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const ESTADOS = [
  'Recibido',
  'En_Cotizacion',
  'Esperando_Aprobacion',
  'En_Reparacion',
  'completada',
  'Entregada',
] as const;

const estadoColors: Record<string, string> = {
  Recibido:             'bg-gray-700/60 text-gray-400 border-gray-500/30',
  En_Cotizacion:       'bg-blue-900/60 text-blue-400 border-blue-500/30',
  Esperando_Aprobacion: 'bg-yellow-900/60 text-yellow-400 border-yellow-500/30',
  En_Reparacion:        'bg-orange-900/60 text-orange-400 border-orange-500/30',
  completada:           'bg-green-900/60 text-green-400 border-green-500/30',
  Entregada:            'bg-purple-900/60 text-purple-400 border-purple-500/30',
};

const estadoLabel: Record<string, string> = {
  Recibido:             'Recibido',
  En_Cotizacion:       'En Cotización',
  Esperando_Aprobacion: 'Esperando Aprobación',
  En_Reparacion:        'En Reparación',
  completada:           'Completada',
  Entregada:            'Entregada',
};

const ADMIN_ID = 'b9f7ef0d-7ef6-4be9-8e53-8548ae9fadb2';

// ── Component ────────────────────────────────────────────────────────────────
const AdminOrdenesServicio: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Data
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenServicio | null>(null);

  // Create form
  const [formDispositivo, setFormDispositivo] = useState('');
  const [formCliente, setFormCliente] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formNotasRiesgo, setFormNotasRiesgo] = useState('');
  const [formPrecio, setFormPrecio] = useState<string>('');
  const [creating, setCreating] = useState(false);

  // Detail edit
  const [editEstado, setEditEstado] = useState<OrdenServicio['estado']>('Recibido');
  const [editAdminDesc, setEditAdminDesc] = useState('');
  const [editPrecioCotizacion, setEditPrecioCotizacion] = useState<string>('');
  const [editPrecioServicio, setEditPrecioServicio] = useState<string>('');
  const [editTrabajoRealizado, setEditTrabajoRealizado] = useState('');
  const [editNotasRiesgo, setEditNotasRiesgo] = useState('');
  const [editAdminImagenes, setEditAdminImagenes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getNextEstado = (current: OrdenServicio['estado']): OrdenServicio['estado'] | null => {
    const idx = ESTADOS.indexOf(current);
    if (idx >= 0 && idx < ESTADOS.length - 1) return ESTADOS[idx + 1];
    return null;
  };

  const uploadAdminImage = async (file: File, numero_orden: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const path = `ordenes/${numero_orden}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('imagenes')
      .upload(path, file, { cacheControl: '31536000, immutable', contentType: file.type, upsert: false });

    if (error) {
      console.error('Error uploading admin image:', error);
      toast({ title: 'Error', description: 'No se pudo subir la imagen', variant: 'destructive' });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(path);

    return publicUrl;
  };

  const generateWhatsAppMessage = async (orden: OrdenServicio, type: 'cotizacion' | 'lista' | 'entrega') => {
    let message = '';
    const cleanPhone = orden.cliente_telefono?.replace(/[^0-9]/g, '');
    const baseUrl = `https://wa.me/57${cleanPhone}`;

    if (type === 'cotizacion') {
      message = `Hola ${orden.cliente_nombre} 👋\n\nTe escribimos de *Aventura Gamer* sobre tu ${orden.dispositivo}.\n\n📋 *Orden:* ${orden.numero_orden}\n🔍 *Diagnóstico:* ${orden.admin_descripcion || 'Pendiente'}\n💰 *Cotización:* $${Number(orden.precio_cotizacion).toLocaleString('es-CO')}\n${orden.notas_riesgo ? `⚠️ *Notas:* ${orden.notas_riesgo}\n` : ''}\n¿Aprobamos la reparación? Respóndenos aquí 🙌`;
      
      // Mark cotizacion_enviada as true
      await supabase.from('ordenes_servicio').update({ cotizacion_enviada: true } as any).eq('id', orden.id);
      setOrdenes(prev => prev.map(o => o.id === orden.id ? { ...o, cotizacion_enviada: true } : o));
    } else if (type === 'lista') {
      message = `Hola ${orden.cliente_nombre} 👋\n\nTu ${orden.dispositivo} está listo en *Aventura Gamer* ✅\n\n📋 *Orden:* ${orden.numero_orden}\n🔧 *Trabajo realizado:* ${orden.trabajo_realizado || 'Reparación completada'}\n💰 *Total a pagar:* $${Number(orden.precio_servicio).toLocaleString('es-CO')}\n\n¡Puedes pasar a recogerlo! Estamos en Calle 36 Sur #41-36 Local 116, Envigado 📍\nLunes a sábado 10:30am – 7:00pm`;
    } else if (type === 'entrega') {
      message = `Hola ${orden.cliente_nombre} 👋\n\nGracias por confiar en *Aventura Gamer* 🎮🛠️\nTu ${orden.dispositivo} fue entregado exitosamente.\n\nSi tienes alguna duda o necesitas otro servicio, aquí estamos 💪`;
    }

    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const generateReceipt = async (orden: OrdenServicio) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const element = document.createElement('div');
    element.style.width = '180mm';
    element.style.padding = '20px';
    element.style.color = '#000';
    element.style.backgroundColor = '#fff';
    element.style.fontFamily = 'Arial, sans-serif';
    
    element.innerHTML = `
      <div style="border: 2px solid #000; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px; color: #000;">AVENTURA GAMER</h1>
          <p style="margin: 5px 0; font-size: 14px;">Servicio Técnico Especializado</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
          <div>
            <p><strong>Orden N°:</strong> ${orden.numero_orden}</p>
            <p><strong>Fecha:</strong> ${format(new Date(), 'dd/MM/yyyy')}</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Estado:</strong> ${estadoLabel[orden.estado]}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; font-size: 16px;">Datos del Cliente</h3>
          <p><strong>Nombre:</strong> ${orden.cliente_nombre}</p>
          <p><strong>Teléfono:</strong> ${orden.cliente_telefono}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; font-size: 16px;">Información del Equipo</h3>
          <p><strong>Dispositivo:</strong> ${orden.dispositivo}</p>
          <p><strong>Falla reportada:</strong> ${orden.descripcion}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; font-size: 16px;">Detalle del Servicio</h3>
          <p>${orden.trabajo_realizado || 'Reparación Técnica / Mantenimiento'}</p>
        </div>
        
        <div style="text-align: right; margin-top: 30px; border-top: 2px solid #000; padding-top: 10px;">
          <h2 style="margin: 0; font-size: 20px;">TOTAL: $${Number(orden.precio_servicio).toLocaleString('es-CO')}</h2>
        </div>
        
        <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #666; border-top: 1px dashed #ccc; padding-top: 20px;">
          <p>Calle 36 Sur #41-36 Local 116, Envigado · Tel: 3505138557</p>
          <p>Instagram: @aventuragamer.co · www.aventuragamer.com</p>
          <p style="margin-top: 10px; font-weight: bold; color: #000;">Garantía de 3 meses en reparaciones de hardware.</p>
        </div>
      </div>
    `;

    document.body.appendChild(element);
    
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      doc.save(`Comprobante_${orden.numero_orden}.pdf`);
    } catch (err) {
      console.error('Error PDF:', err);
      toast({ title: 'Error', description: 'No se pudo generar el comprobante', variant: 'destructive' });
    } finally {
      document.body.removeChild(element);
    }
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  const fetchOrdenes = async () => {
    try {
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdenes((data as unknown as OrdenServicio[]) || []);
    } catch (err) {
      console.error('Error fetch:', err);
      toast({ title: 'Error', description: 'No se pudieron cargar las órdenes', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrdenes(); }, []);

  useEffect(() => {
    if (location.state?.descripcion_sugerida) {
      setFormDescripcion(location.state.descripcion_sugerida);
      if (location.state?.servicio_nombre) setFormDispositivo(location.state.servicio_nombre);
      setShowCreateModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ── Form Handlers ─────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!formDispositivo || !formCliente || !formDescripcion) {
      toast({ title: 'Faltan datos', description: 'Dispositivo, Cliente y Descripción son obligatorios.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .insert({
          usuario_id: user?.id || ADMIN_ID,
          dispositivo: formDispositivo,
          cliente_nombre: formCliente,
          cliente_telefono: formTelefono,
          descripcion: formDescripcion,
          notas_riesgo: formNotasRiesgo,
          precio_servicio: Number(formPrecio) || 0,
          estado: 'Recibido',
          tecnico_nombre: 'Saturno - Aventura Gamer'
        } as any)
        .select()
        .single();

      if (error) throw error;
      setOrdenes([data as unknown as OrdenServicio, ...ordenes]);
      toast({ title: 'Éxito', description: 'Orden creada correctamente.' });
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Error create:', err);
      toast({ title: 'Error', description: 'No se pudo crear la orden.', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormDispositivo('');
    setFormCliente('');
    setFormTelefono('');
    setFormDescripcion('');
    setFormNotasRiesgo('');
    setFormPrecio('');
  };

  const openDetail = (orden: OrdenServicio) => {
    setSelectedOrden(orden);
    setEditEstado(orden.estado);
    setEditAdminDesc(orden.admin_descripcion || '');
    setEditPrecioCotizacion(orden.precio_cotizacion?.toString() || '');
    setEditPrecioServicio(orden.precio_servicio?.toString() || '');
    setEditTrabajoRealizado(orden.trabajo_realizado || '');
    setEditNotasRiesgo(orden.notas_riesgo || '');
    setEditAdminImagenes(orden.admin_imagenes || []);
  };

  const handleSaveDetail = async (targetEstado?: OrdenServicio['estado']) => {
    if (!selectedOrden) return;
    setSaving(true);
    try {
      const finalEstado = targetEstado || editEstado;
      const updateData: Partial<OrdenServicio> = {
        estado: finalEstado,
        admin_descripcion: editAdminDesc,
        precio_cotizacion: editPrecioCotizacion ? Number(editPrecioCotizacion) : null,
        precio_servicio: editPrecioServicio ? Number(editPrecioServicio) : null,
        trabajo_realizado: editTrabajoRealizado,
        notas_riesgo: editNotasRiesgo,
        admin_imagenes: editAdminImagenes,
      };

      const { error } = await supabase
        .from('ordenes_servicio')
        .update(updateData as any)
        .eq('id', selectedOrden.id);

      if (error) throw error;

      setOrdenes(ordenes.map(o => o.id === selectedOrden.id ? { ...o, ...updateData } : o));
      setSelectedOrden(prev => prev ? { ...prev, ...updateData } : null);
      
      toast({ title: 'Actualizado', description: 'Cambios guardados correctamente.' });
      if (targetEstado) setSelectedOrden(null);
    } catch (err) {
      console.error('Error save:', err);
      toast({ title: 'Error', description: 'No se pudo actualizar.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ── Render Helpers ────────────────────────────────────────────────────────
  const badgeClass = (estado: string) =>
    `text-[10px] px-2 py-0.5 rounded-full border font-rajdhani font-bold uppercase tracking-wider ${estadoColors[estado] || 'bg-gray-700/60 text-gray-400 border-gray-500/30'}`;

  const formatPrice = (p: number | null | undefined) => 
    p ? `$${Number(p).toLocaleString('es-CO')}` : '—';

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-400 h-10 w-10" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-cyan-400 tracking-wider">Servicio Técnico</h2>
          <p className="font-rajdhani text-gray-400 text-sm">Panel de taller Aventura Gamer</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 rounded-lg px-4 py-2 font-rajdhani font-bold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Nueva Orden
        </button>
      </div>

      {ordenes.length === 0 ? (
        <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-20 text-center">
           <Wrench className="h-12 w-12 mx-auto text-gray-700 mb-4" />
           <p className="font-rajdhani text-gray-500">No hay órdenes registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordenes.map(o => (
            <div key={o.id} className="bg-gray-900/80 border border-cyan-500/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="font-orbitron text-cyan-500/60 text-xs font-bold">{o.numero_orden}</span>
                <span className={badgeClass(o.estado)}>{estadoLabel[o.estado]}</span>
              </div>
              <h3 className="font-rajdhani text-white text-lg font-bold truncate">{o.dispositivo || 'Sin dispositivo'}</h3>
              <div className="space-y-1 text-sm font-rajdhani text-gray-400">
                <p className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> {o.cliente_nombre}</p>
                <p className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5" /> {o.cliente_telefono}</p>
                <p className="font-bold text-white mt-2 italic text-xs truncate">Reporte: {o.descripcion}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                 <span className="text-[10px] text-gray-600 font-bold uppercase">{o.created_at ? format(new Date(o.created_at), 'dd/MM/yyyy') : '--'}</span>
                 <button onClick={() => openDetail(o)} className="text-cyan-400 hover:text-cyan-300 font-rajdhani font-bold text-xs uppercase flex items-center gap-1">
                   <Eye className="h-3.5 w-3.5" /> Detalle
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Nueva Orden */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 space-y-4">
             <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="font-orbitron text-cyan-400 font-bold tracking-widest uppercase text-sm">Nueva Orden</h3>
                <button onClick={() => setShowCreateModal(false)}><X className="text-gray-500" /></button>
             </div>
             <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Dispositivo</label>
                      <input value={formDispositivo} onChange={e => setFormDispositivo(e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 w-full text-sm font-rajdhani text-white focus:border-cyan-500/50 outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 uppercase font-bold">Cliente</label>
                      <input value={formCliente} onChange={e => setFormCliente(e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 w-full text-sm font-rajdhani text-white focus:border-cyan-500/50 outline-none" />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] text-gray-500 uppercase font-bold">WhatsApp</label>
                   <input value={formTelefono} onChange={e => setFormTelefono(e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 w-full text-sm font-rajdhani text-white focus:border-cyan-500/50 outline-none" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] text-gray-500 uppercase font-bold">Descripción del Falla</label>
                   <textarea value={formDescripcion} onChange={e => setFormDescripcion(e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 w-full text-sm font-rajdhani text-white focus:border-cyan-500/50 outline-none resize-none" rows={3} />
                </div>
             </div>
             <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button onClick={handleCreate} disabled={creating} className="bg-cyan-500 hover:bg-cyan-600 text-black font-rajdhani font-bold px-6 py-2 rounded uppercase text-sm flex items-center gap-2">
                   {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />} Crear
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Modal: Ver Detalle Profesional */}
      {selectedOrden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl overflow-x-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-gray-950 z-10">
              <div>
                <span className="font-orbitron text-cyan-500/40 text-[10px] font-bold tracking-[0.2em]">{selectedOrden.numero_orden || 'PENDIENTE'}</span>
                <h3 className="font-rajdhani text-white text-xl font-bold uppercase tracking-tight">{selectedOrden.dispositivo}</h3>
              </div>
              <button onClick={() => setSelectedOrden(null)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"><X className="text-gray-500 h-6 w-6" /></button>
            </div>

            <div className="p-6 space-y-8">
              <div className="flex items-center gap-3">
                <span className={badgeClass(selectedOrden.estado)}>{estadoLabel[selectedOrden.estado]}</span>
                {selectedOrden.cotizacion_enviada && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-widest">Enviado</span>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Cliente</label>
                  <p className="font-rajdhani text-gray-200 font-bold mt-1 text-sm truncate">{selectedOrden.cliente_nombre}</p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">WhatsApp</label>
                  <p className="font-rajdhani text-gray-200 font-bold mt-1 text-sm">{selectedOrden.cliente_telefono}</p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Técnico</label>
                  <p className="font-rajdhani text-gray-200 font-bold mt-1 text-sm">Saturno</p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total</label>
                  <p className="font-rajdhani text-cyan-400 font-bold mt-1 text-sm">{formatPrice(selectedOrden.precio_servicio)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Reporte Cliente</label>
                    <div className="bg-black/60 border border-white/5 rounded-xl p-4 text-sm font-rajdhani text-gray-300 leading-relaxed min-h-[80px]">
                       {selectedOrden.descripcion}
                    </div>
                 </div>
                 {selectedOrden.imagenes_entrada?.length > 0 && (
                   <div>
                      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Fotos de Entrada</label>
                      <div className="flex gap-2">
                         {selectedOrden.imagenes_entrada.map((url, i) => (
                           <div key={i} className="h-20 w-20 rounded-lg border border-white/10 overflow-hidden cursor-pointer hover:border-cyan-500/40" onClick={() => window.open(url, '_blank')}>
                              <img src={url} className="w-full h-full object-cover" />
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                 <div className="flex items-center justify-between">
                    <h4 className="font-orbitron text-cyan-500 text-xs font-bold tracking-[0.2em] uppercase">Gestión Workflow</h4>
                    {selectedOrden.estado !== 'Entregada' && (
                       <button onClick={() => handleSaveDetail(getNextEstado(selectedOrden.estado)!)} disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 text-black text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                          {saving ? <Loader2 className="animate-spin h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                          Avanzar a {estadoLabel[getNextEstado(selectedOrden.estado)!]}
                       </button>
                    )}
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {selectedOrden.estado === 'Esperando_Aprobacion' && (
                      <button onClick={() => generateWhatsAppMessage(selectedOrden, 'cotizacion')} className="col-span-2 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                        <MessageCircle className="h-4 w-4" /> Enviar Cotización (WA)
                      </button>
                    )}
                    {selectedOrden.estado === 'completada' && (
                      <button onClick={() => generateWhatsAppMessage(selectedOrden, 'lista')} className="col-span-2 border border-green-500/30 text-green-500 hover:bg-green-500/10 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Notificar Listo (WA)
                      </button>
                    )}
                    {(selectedOrden.estado === 'completada' || selectedOrden.estado === 'Entregada') && (
                      <button onClick={() => generateReceipt(selectedOrden)} className="col-span-2 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-[10px] font-bold uppercase py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" /> Descargar Comprobante PDF
                      </button>
                    )}
                 </div>

                 <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1">Diagnóstico Admin</label>
                            <textarea value={editAdminDesc} onChange={e => setEditAdminDesc(e.target.value)} placeholder="..." className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 w-full text-sm font-rajdhani text-gray-200 mt-2 focus:border-cyan-500/40 outline-none resize-none" rows={3} />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1">Notas de Riesgo ⚠️</label>
                            <input value={editNotasRiesgo} onChange={e => setEditNotasRiesgo(e.target.value)} className="bg-orange-950/20 border border-orange-500/20 rounded-xl px-4 py-2 w-full text-sm font-rajdhani text-orange-200 mt-2 outline-none focus:border-orange-500/50" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div>
                             <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest pl-1">Trabajo Realizado</label>
                             <textarea value={editTrabajoRealizado} onChange={e => setEditTrabajoRealizado(e.target.value)} placeholder="..." className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 w-full text-sm font-rajdhani text-gray-200 mt-2 focus:border-green-500/40 outline-none resize-none" rows={3} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Cotización ($)</label>
                                <input value={editPrecioCotizacion} onChange={e => setEditPrecioCotizacion(e.target.value.replace(/[^0-9]/g, ''))} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 w-full text-sm mt-2 font-bold font-rajdhani text-white outline-none focus:border-cyan-500/50" />
                             </div>
                             <div>
                                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Cobrado ($)</label>
                                <input value={editPrecioServicio} onChange={e => setEditPrecioServicio(e.target.value.replace(/[^0-9]/g, ''))} className="bg-black/40 border border-green-500/20 rounded-xl px-4 py-2 w-full text-sm mt-2 font-bold font-rajdhani text-green-400 outline-none focus:border-green-500/50" />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-4">
                       <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Fotos de Diagnóstico / Proceso</label>
                       <div className="flex flex-wrap gap-2">
                          {editAdminImagenes.map((url, i) => (
                            <div key={i} className="h-16 w-16 rounded-lg border border-white/10 overflow-hidden relative group">
                               <img src={url} className="w-full h-full object-cover" />
                               <button onClick={() => setEditAdminImagenes(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X className="h-4 w-4 text-white" /></button>
                            </div>
                          ))}
                          <label className="h-16 w-16 rounded-lg border-2 border-dashed border-white/10 hover:border-cyan-500/40 flex items-center justify-center cursor-pointer">
                             <Plus className="h-5 w-5 text-gray-600" />
                             <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                               if (e.target.files?.[0]) {
                                 const url = await uploadAdminImage(e.target.files[0], selectedOrden.numero_orden || 'ADMIN');
                                 if (url) setEditAdminImagenes(prev => [...prev, url]);
                               }
                             }} />
                          </label>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-gray-950 z-10">
               <button onClick={() => setSelectedOrden(null)} className="px-6 py-2 text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-colors">Cerrar</button>
               <button onClick={() => handleSaveDetail()} disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 text-black px-8 py-2.5 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all">
                  {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4" />} Guardar Cambios
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdenesServicio;
