import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrdenesServicio } from '@/hooks/useOrdenesServicio';
import GamingImageUpload from '@/components/GamingImageUpload';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  User, 
  Plus, 
  Wrench, 
  ArrowLeft,
  Clock,
  CheckCircle,
  Package,
  Eye
} from 'lucide-react';

interface OrdenServicio {
  id: string;
  usuario_id: string;
  estado: string;
  descripcion: string;
  admin_descripcion?: string;
  admin_imagenes?: string[];
  created_at: string;
  updated_at: string;
}

const getStatusColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'recibido':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    case 'en_diagnostico':
    case 'diagnostico':
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    case 'esperando_aprobacion':
      return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    case 'reparando':
      return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
    case 'completado':
      return 'bg-green-500/20 text-green-600 border-green-500/30';
    case 'entregado':
      return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  }
};

const getStatusIcon = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'recibido':
      return <Package className="h-4 w-4" />;
    case 'en_diagnostico':
    case 'diagnostico':
      return <Eye className="h-4 w-4" />;
    case 'esperando_aprobacion':
      return <Clock className="h-4 w-4" />;
    case 'reparando':
      return <Wrench className="h-4 w-4" />;
    case 'completado':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const GestionUsuarios = () => {
  const { usuarios, loading, fetchOrdenesByUsuario, crearOrden, actualizarEstadoOrden, subirImagen } = useOrdenesServicio();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<typeof usuarios[0] | null>(null);
  const [ordenesUsuario, setOrdenesUsuario] = useState<OrdenServicio[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrdenServicio | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);

  const handleSelectUser = async (usuario: typeof usuarios[0]) => {
    setUsuarioSeleccionado(usuario);
    setLoadingOrdenes(true);
    const ordenes = await fetchOrdenesByUsuario(usuario.id);
    setOrdenesUsuario(ordenes);
    setLoadingOrdenes(false);
  };

  const handleCreateOrden = async () => {
    if (!usuarioSeleccionado || !nuevaDescripcion.trim()) return;

    const nuevaOrden = await crearOrden(usuarioSeleccionado.id, nuevaDescripcion);
    if (nuevaOrden) {
      setOrdenesUsuario(prev => [nuevaOrden, ...prev]);
      setNuevaDescripcion('');
      setIsCreateOpen(false);
    }
  };

  const handleUpdateStatus = async (ordenId: string, nuevoEstado: string) => {
    await actualizarEstadoOrden(ordenId, nuevoEstado);
    setOrdenesUsuario(prev => prev.map(orden => 
      orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden
    ));
  };

  const handleUpdateWithImages = async (files: File[], description: string) => {
    if (!selectedOrder) return;

    try {
      // Subir imágenes
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await subirImagen(file, selectedOrder.id);
        if (url) imageUrls.push(url);
      }

      // Actualizar orden con nuevo estado, descripción e imágenes
      await actualizarEstadoOrden(
        selectedOrder.id, 
        newStatus, 
        description, 
        imageUrls.length > 0 ? imageUrls : undefined
      );

      // Actualizar estado local
      setOrdenesUsuario(prev => prev.map(orden => 
        orden.id === selectedOrder.id 
          ? { 
              ...orden, 
              estado: newStatus,
              admin_descripcion: description,
              admin_imagenes: [...(orden.admin_imagenes || []), ...imageUrls]
            } 
          : orden
      ));

      setIsUpdateOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const openUpdateDialog = (orden: OrdenServicio, estado: string) => {
    setSelectedOrder(orden);
    setNewStatus(estado);
    setIsUpdateOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Vista de lista de usuarios
  if (!usuarioSeleccionado) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-glow">Seleccionar Usuario</h3>
            <p className="text-muted-foreground">Elige un usuario para gestionar sus órdenes de servicio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((usuario) => (
            <Card 
              key={usuario.id} 
              className="card-gaming border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => handleSelectUser(usuario)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{usuario.username || 'Sin nombre'}</h3>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    {usuario.role && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {usuario.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Vista de detalle del usuario seleccionado
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setUsuarioSeleccionado(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a usuarios
          </Button>
          <div>
            <h3 className="text-lg font-semibold text-glow">
              Órdenes de {usuarioSeleccionado.username || 'Usuario'}
            </h3>
            <p className="text-muted-foreground">{usuarioSeleccionado.email}</p>
          </div>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gaming">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent className="card-gaming border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-glow">Nueva Orden para {usuarioSeleccionado.username}</DialogTitle>
              <DialogDescription>
                Registra un nuevo equipo para reparación o mantenimiento
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción del Problema</Label>
                <Textarea 
                  id="descripcion"
                  placeholder="Describe el problema del equipo..."
                  className="bg-background/50"
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleCreateOrden} 
                  className="btn-gaming flex-1"
                  disabled={!nuevaDescripcion.trim()}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Crear Orden
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de órdenes del usuario */}
      <div className="space-y-4">
        {loadingOrdenes ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : ordenesUsuario.length === 0 ? (
          <Card className="card-gaming border-primary/20">
            <CardContent className="p-8 text-center">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay órdenes para este usuario</h3>
              <p className="text-muted-foreground">
                Crea la primera orden de servicio para {usuarioSeleccionado.username}
              </p>
            </CardContent>
          </Card>
        ) : (
          ordenesUsuario.map((orden) => (
            <Card key={orden.id} className="card-gaming border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {getStatusIcon(orden.estado)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">Orden #{orden.id.slice(-6)}</CardTitle>
                      <CardDescription>
                        Creada: {format(new Date(orden.created_at), 'dd MMM yyyy', { locale: es })}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(orden.estado)}>
                    {orden.estado}
                  </Badge>
                </div>
              </CardHeader>
               <CardContent className="space-y-4">
                <p className="text-sm">{orden.descripcion}</p>
                
                {/* Mostrar descripción e imágenes del admin si existen */}
                {orden.admin_descripcion && (
                  <div className="bg-primary/10 rounded-lg p-3 space-y-2">
                    <h4 className="text-sm font-semibold text-primary">Actualización del Técnico:</h4>
                    <p className="text-sm text-muted-foreground">{orden.admin_descripcion}</p>
                  </div>
                )}
                
                {orden.admin_imagenes && orden.admin_imagenes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-secondary">Imágenes del servicio:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {orden.admin_imagenes.map((imagen, index) => (
                        <div key={index} className="aspect-square bg-muted/30 rounded-lg overflow-hidden">
                          <img
                            src={imagen}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(imagen, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(orden, 'En_Diagnostico')}
                    className="border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
                  >
                    En Diagnóstico
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(orden, 'Esperando_Aprobacion')}
                    className="border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
                  >
                    Esperando Aprobación
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(orden, 'Reparando')}
                    className="border-purple-500/30 text-purple-600 hover:bg-purple-500/10"
                  >
                    Reparando
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(orden, 'Completado')}
                    className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                  >
                    Completado
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUpdateDialog(orden, 'Entregado')}
                    className="border-gray-500/30 text-gray-600 hover:bg-gray-500/10"
                  >
                    Entregado
                  </Button>
                </div>
               </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog para actualización con imágenes */}
      <GamingImageUpload
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedOrder(null);
          setNewStatus('');
        }}
        onUpload={handleUpdateWithImages}
        title={`Actualizar a: ${newStatus.replace('_', ' ')}`}
      />
    </div>
  );
};

export default GestionUsuarios;