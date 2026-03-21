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
  Image as ImageIcon
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

// ── Types ────────────────────────────────────────────────────────────────────
interface OrdenServicio {
  id: string;
  numero_orden: string;
  usuario_id: string;
  estado: string;
  dispositivo: string;
  cliente_nombre: string;
  cliente_telefono: string;
  descripcion: string;
  notas_riesgo: string;
  precio_servicio: number;
  tecnico_nombre: string;
  imagenes_entrada: string[];
  admin_descripcion: string;
  admin_imagenes: string[];
  created_at: string;
  updated_at: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const ESTADOS = [
  'Recibido',
  'En_Diagnostico',
  'Esperando_Aprobacion',
  'En_Reparacion',
  'Listo',
  'Entregado',
] as const;

const estadoColors: Record<string, string> = {
  Recibido:             'bg-blue-900/60 text-blue-400 border-blue-500/30',
  En_Diagnostico:       'bg-yellow-900/60 text-yellow-400 border-yellow-500/30',
  Esperando_Aprobacion: 'bg-orange-900/60 text-orange-400 border-orange-500/30',
  En_Reparacion:        'bg-purple-900/60 text-purple-400 border-purple-500/30',
  Listo:                'bg-green-900/60 text-green-400 border-green-500/30',
  Entregado:            'bg-gray-700/60 text-gray-400 border-gray-500/30',
};

const estadoLabel: Record<string, string> = {
  Recibido:             'Recibido',
  En_Diagnostico:       'En Diagnóstico',
  Esperando_Aprobacion: 'Esperando Aprobación',
  En_Reparacion:        'En Reparación',
  Listo:                'Listo',
  Entregado:            'Entregado',
};

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
  const [editEstado, setEditEstado] = useState('');
  const [editAdminDesc, setEditAdminDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchOrdenes = async () => {
    try {
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdenes((data as unknown as OrdenServicio[]) || []);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      toast({ title: 'Error', description: 'No se pudieron cargar las órdenes de servicio', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrdenes(); }, []);

  // Check for pre-filled data from URL navigation
  useEffect(() => {
    if (location.state?.descripcion_sugerida) {
      setFormDescripcion(location.state.descripcion_sugerida);
      if (location.state?.servicio_nombre) {
        setFormDispositivo(location.state.servicio_nombre);
      }
      setShowCreateModal(true);
      // Clean up the location state so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!formDispositivo.trim() || !formCliente.trim() || !formDescripcion.trim()) {
      toast({ title: 'Campos requeridos', description: 'Dispositivo, Cliente y Descripción son obligatorios.', variant: 'destructive' });
      return;
    }
    if (!user) return;

    setCreating(true);
    try {
      const insertData: Record<string, unknown> = {
        usuario_id: user.id,
        dispositivo: formDispositivo.trim(),
        cliente_nombre: formCliente.trim(),
        cliente_telefono: formTelefono.trim(),
        descripcion: formDescripcion.trim(),
        notas_riesgo: formNotasRiesgo.trim(),
        precio_servicio: formPrecio ? Number(formPrecio) : 0,
        estado: 'Recibido',
        tecnico_nombre: 'John Jairo - Aventura Gamer',
      };

      const { data, error } = await supabase
        .from('ordenes_servicio')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;

      setOrdenes(prev => [(data as unknown as OrdenServicio), ...prev]);
      toast({ title: '✅ Orden creada', description: `Orden creada exitosamente` });
      resetForm();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error al crear orden:', err);
      toast({ title: 'Error', description: 'No se pudo crear la orden', variant: 'destructive' });
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

  // ── Update detail ──────────────────────────────────────────────────────────
  const openDetail = (orden: OrdenServicio) => {
    setSelectedOrden(orden);
    setEditEstado(orden.estado);
    setEditAdminDesc(orden.admin_descripcion || '');
  };

  const handleSaveDetail = async () => {
    if (!selectedOrden) return;
    setSaving(true);
    try {
      const updateData: Record<string, unknown> = {
        estado: editEstado,
        admin_descripcion: editAdminDesc,
      };

      const { error } = await supabase
        .from('ordenes_servicio')
        .update(updateData as any)
        .eq('id', selectedOrden.id);

      if (error) throw error;

      setOrdenes(prev =>
        prev.map(o =>
          o.id === selectedOrden.id
            ? { ...o, estado: editEstado, admin_descripcion: editAdminDesc }
            : o
        )
      );
      toast({ title: '✅ Actualizado', description: 'Orden actualizada correctamente' });
      setSelectedOrden(null);
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast({ title: 'Error', description: 'No se pudo actualizar la orden', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const badgeClass = (estado: string) =>
    `text-xs px-2 py-0.5 rounded-full border font-rajdhani font-semibold ${estadoColors[estado] || 'bg-gray-700/60 text-gray-400 border-gray-500/30'}`;

  const riskBadge = (notas: string | null | undefined) => {
    if (notas && notas.trim().length > 0) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full border font-rajdhani font-semibold bg-red-900/60 text-red-400 border-red-500/30">
          🔴 RIESGO
        </span>
      );
    }
    return (
      <span className="text-xs px-2 py-0.5 rounded-full border font-rajdhani font-semibold bg-green-900/60 text-green-400 border-green-500/30">
        ✅ Normal
      </span>
    );
  };

  const truncate = (text: string | null | undefined, max = 60) => {
    if (!text) return '—';
    return text.length > max ? text.slice(0, max) + '…' : text;
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price && price !== 0) return '—';
    return `$${Number(price).toLocaleString('es-CO')}`;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-2xl font-bold text-cyan-400 tracking-wider">
            Órdenes de Servicio
          </h2>
          <p className="font-rajdhani text-gray-400 text-sm mt-1">
            Gestiona las órdenes de servicio técnico
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 rounded-lg px-4 py-2 font-rajdhani font-semibold transition-all flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          Nueva Orden
        </button>
      </div>

      {/* Grid de cards */}
      {ordenes.length === 0 ? (
        <div className="bg-gray-900/80 border border-cyan-500/20 rounded-xl p-12 text-center">
          <FileText className="h-14 w-14 mx-auto mb-4 text-gray-600" />
          <h3 className="font-rajdhani text-lg font-semibold text-gray-400">
            No hay órdenes de servicio
          </h3>
          <p className="font-rajdhani text-sm text-gray-600 mt-1">
            Crea la primera orden con el botón "Nueva Orden"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordenes.map(orden => (
            <div
              key={orden.id}
              className="bg-gray-900/80 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all flex flex-col gap-3"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-orbitron text-cyan-400 text-xs font-bold tracking-wider">
                    {orden.numero_orden || '—'}
                  </span>
                  <h3 className="font-rajdhani text-white text-lg font-semibold truncate mt-0.5">
                    {orden.dispositivo || 'Sin dispositivo'}
                  </h3>
                </div>
                {riskBadge(orden.notas_riesgo)}
              </div>

              {/* Client */}
              <div className="flex items-center gap-2 text-gray-400 text-sm font-rajdhani">
                <User className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{orden.cliente_nombre || '—'}</span>
                {orden.cliente_telefono && (
                  <>
                    <Phone className="h-3.5 w-3.5 flex-shrink-0 ml-2" />
                    <span>{orden.cliente_telefono}</span>
                  </>
                )}
              </div>

              {/* Estado + Técnico */}
              <div className="flex items-center flex-wrap gap-2">
                <span className={badgeClass(orden.estado)}>
                  {estadoLabel[orden.estado] || orden.estado}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm font-rajdhani">
                <Wrench className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{orden.tecnico_nombre || '—'}</span>
              </div>

              {/* Precio */}
              <div className="flex items-center gap-2 text-gray-400 text-sm font-rajdhani">
                <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="font-semibold text-white">
                  {formatPrice(orden.precio_servicio)}
                </span>
              </div>

              {/* Notas riesgo truncadas */}
              {orden.notas_riesgo && (
                <p className="text-xs text-orange-400/80 font-rajdhani leading-tight line-clamp-2">
                  ⚠️ {truncate(orden.notas_riesgo, 80)}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-cyan-500/10">
                <span className="text-xs text-gray-600 font-rajdhani">
                  {orden.created_at
                    ? format(new Date(orden.created_at), 'dd MMM yyyy', { locale: es })
                    : '—'}
                </span>
                <button
                  onClick={() => openDetail(orden)}
                  className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-lg px-3 py-1 text-xs font-rajdhani font-semibold transition-all flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Nueva Orden ─────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-cyan-500/20">
              <h3 className="font-orbitron text-cyan-400 text-lg font-bold tracking-wider">
                Nueva Orden de Servicio
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Dispositivo */}
              <div>
                <label className="block text-sm font-rajdhani font-semibold text-gray-300 mb-1">
                  Dispositivo <span className="text-red-400">*</span>
                </label>
                <input
                  value={formDispositivo}
                  onChange={e => setFormDispositivo(e.target.value)}
                  placeholder="Ej: PS5, Nintendo Switch, PC Gamer…"
                  className="bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 w-full font-rajdhani"
                />
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-sm font-rajdhani font-semibold text-gray-300 mb-1">
                  Nombre del Cliente <span className="text-red-400">*</span>
                </label>
                <input
                  value={formCliente}
                  onChange={e => setFormCliente(e.target.value)}
                  placeholder="Nombre completo"
                  className="bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 w-full font-rajdhani"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-rajdhani font-semibold text-gray-300 mb-1">
                  Teléfono
                </label>
                <input
                  value={formTelefono}
                  onChange={e => setFormTelefono(e.target.value)}
                  placeholder="Ej: 300 1234567"
                  className="bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 w-full font-rajdhani"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-rajdhani font-semibold text-gray-300 mb-1">
                  Descripción <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formDescripcion}
                  onChange={e => setFormDescripcion(e.target.value)}
                  placeholder="Describe el problema del equipo…"
                  rows={3}
                  className="bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 w-full font-rajdhani resize-none"
                />
              </div>

              {/* Notas de riesgo */}
              <div>
                <label className="block text-sm font-rajdhani font-semibold text-orange-400 mb-1">
                  ⚠️ Notas de Riesgo
                </label>
                <textarea
                  value={formNotasRiesgo}
                  onChange={e => setFormNotasRiesgo(e.target.value)}
                  placeholder="Daños preexistentes, riesgos, advertencias…"
                  rows={2}
                  className="bg-orange-950/30 border border-orange-500/40 rounded-lg px-3 py-2 text-orange-200 placeholder-orange-800 focus:outline-none focus:border-orange-400 w-full font-rajdhani resize-none"
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-rajdhani font-semibold text-gray-300 mb-1">
                  Precio del servicio
                </label>
                <input
                  value={formPrecio}
                  onChange={e => setFormPrecio(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0"
                  type="text"
                  inputMode="numeric"
                  className="bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 w-full font-rajdhani"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-cyan-500/20">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-rajdhani font-semibold transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 rounded-lg px-5 py-2 font-rajdhani font-semibold transition-all flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Crear Orden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Ver Detalle ─────────────────────────────────────────────── */}
      {selectedOrden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-950 border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-cyan-500/20">
              <div>
                <span className="font-orbitron text-cyan-400 text-xs font-bold tracking-wider">
                  {selectedOrden.numero_orden || '—'}
                </span>
                <h3 className="font-rajdhani text-white text-xl font-semibold mt-1">
                  {selectedOrden.dispositivo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrden(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Estado + Risk */}
              <div className="flex items-center flex-wrap gap-2">
                {riskBadge(selectedOrden.notas_riesgo)}
                <span className={badgeClass(selectedOrden.estado)}>
                  {estadoLabel[selectedOrden.estado] || selectedOrden.estado}
                </span>
              </div>

              {/* Client info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 font-rajdhani uppercase tracking-wide">Cliente</span>
                  <p className="font-rajdhani text-gray-200 mt-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-cyan-500" />
                    {selectedOrden.cliente_nombre || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-rajdhani uppercase tracking-wide">Teléfono</span>
                  <p className="font-rajdhani text-gray-200 mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-cyan-500" />
                    {selectedOrden.cliente_telefono || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-rajdhani uppercase tracking-wide">Técnico</span>
                  <p className="font-rajdhani text-gray-200 mt-1 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-cyan-500" />
                    {selectedOrden.tecnico_nombre || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-rajdhani uppercase tracking-wide">Precio</span>
                  <p className="font-rajdhani text-gray-200 mt-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-cyan-500" />
                    {formatPrice(selectedOrden.precio_servicio)}
                  </p>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <span className="text-xs text-gray-500 font-rajdhani uppercase tracking-wide">Descripción</span>
                <p className="font-rajdhani text-gray-300 mt-1 text-sm leading-relaxed">
                  {selectedOrden.descripcion || '—'}
                </p>
              </div>

              {/* Notas de riesgo completas */}
              {selectedOrden.notas_riesgo && (
                <div className="bg-orange-950/30 border border-orange-500/30 rounded-xl p-4">
                  <span className="text-xs text-orange-400 font-rajdhani uppercase tracking-wide flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Notas de Riesgo
                  </span>
                  <p className="font-rajdhani text-orange-200 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedOrden.notas_riesgo}
                  </p>
                </div>
              )}

              {/* Imágenes de entrada */}
              {selectedOrden.imagenes_entrada && selectedOrden.imagenes_entrada.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 font-rajdhani uppercase tracking-wide flex items-center gap-1 mb-2">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Imágenes de Entrada
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedOrden.imagenes_entrada.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-cyan-500/10 hover:border-cyan-500/40 transition-all"
                        onClick={() => window.open(img, '_blank')}
                      >
                        <img
                          src={img}
                          alt={`Entrada ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4 text-xs font-rajdhani text-gray-500">
                <div>
                  <span>Creada:</span>
                  <p className="text-gray-300 mt-0.5">
                    {selectedOrden.created_at
                      ? format(new Date(selectedOrden.created_at), "dd MMM yyyy 'a las' HH:mm", { locale: es })
                      : '—'}
                  </p>
                </div>
                <div>
                  <span>Actualizada:</span>
                  <p className="text-gray-300 mt-0.5">
                    {selectedOrden.updated_at
                      ? format(new Date(selectedOrden.updated_at), "dd MMM yyyy 'a las' HH:mm", { locale: es })
                      : '—'}
                  </p>
                </div>
              </div>

              <hr className="border-cyan-500/10" />

              {/* ── Edit section ─────────────────────────────────────────── */}
              <div className="space-y-4">
                <h4 className="font-orbitron text-cyan-400 text-sm font-bold tracking-wider">
                  Actualizar Orden
                </h4>

                {/* Cambiar estado */}
                <div>
                  <label className="block text-sm font-rajdhani font-semibold text-gray-300 mb-1">
                    Estado
                  </label>
                  <select
                    value={editEstado}
                    onChange={e => setEditEstado(e.target.value)}
                    className="bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-cyan-400 w-full font-rajdhani"
                  >
                    {ESTADOS.map(e => (
                      <option key={e} value={e}>
                        {estadoLabel[e] || e}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Admin descripción */}
                <div>
                  <label className="block text-sm font-rajdhani font-semibold text-gray-300 mb-1">
                    Descripción del Admin / Técnico
                  </label>
                  <textarea
                    value={editAdminDesc}
                    onChange={e => setEditAdminDesc(e.target.value)}
                    placeholder="Notas o actualización del técnico…"
                    rows={3}
                    className="bg-gray-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 w-full font-rajdhani resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-cyan-500/20">
              <button
                onClick={() => setSelectedOrden(null)}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-rajdhani font-semibold transition-all text-sm"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveDetail}
                disabled={saving}
                className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 rounded-lg px-5 py-2 font-rajdhani font-semibold transition-all flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdenesServicio;
