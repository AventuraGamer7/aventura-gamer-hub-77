import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTechnicalServices, mockUsers, TechnicalService } from '@/hooks/useTechnicalServices';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Plus, 
  Wrench, 
  User, 
  Package, 
  Eye, 
  Settings, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  MessageCircle,
  DollarSign,
  Edit
} from 'lucide-react';

interface CreateServiceForm {
  clienteId: string;
  descripcion: string;
}

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'recibido':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
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

const getStatusText = (estado: string) => {
  switch (estado) {
    case 'recibido':
      return 'Recibido';
    case 'diagnostico':
      return 'En Diagnóstico';
    case 'esperando_aprobacion':
      return 'Esperando Aprobación';
    case 'reparando':
      return 'Reparando';
    case 'completado':
      return 'Completado';
    case 'entregado':
      return 'Entregado';
    default:
      return 'Desconocido';
  }
};

const getStatusIcon = (estado: string) => {
  switch (estado) {
    case 'recibido':
      return <Package className="h-4 w-4" />;
    case 'diagnostico':
      return <Eye className="h-4 w-4" />;
    case 'esperando_aprobacion':
      return <AlertCircle className="h-4 w-4" />;
    case 'reparando':
      return <Settings className="h-4 w-4" />;
    case 'completado':
      return <CheckCircle className="h-4 w-4" />;
    case 'entregado':
      return <Truck className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const TechnicalServicesAdmin = () => {
  const { services, createService, updateService, addComment } = useTechnicalServices();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const form = useForm<CreateServiceForm>({
    defaultValues: {
      clienteId: '',
      descripcion: ''
    }
  });

  const handleCreateService = (data: CreateServiceForm) => {
    if (!selectedUser) return;

    createService({
      clienteId: selectedUser.id,
      clienteName: selectedUser.name,
      descripcion: data.descripcion,
      imagenes: []
    });

    toast({
      title: "Servicio creado",
      description: `Servicio para ${selectedUser.name} creado exitosamente`,
    });

    form.reset();
    setIsCreateOpen(false);
  };

  const getUserServices = (userId: string) => {
    return services.filter(service => service.clienteId === userId);
  };

  const handleStatusUpdate = (serviceId: string, newStatus: TechnicalService['estado']) => {
    updateService(serviceId, { estado: newStatus });
    toast({
      title: "Estado actualizado",
      description: `Estado cambiado a: ${getStatusText(newStatus)}`,
    });
  };

  const handleCostUpdate = (serviceId: string, cost: number) => {
    updateService(serviceId, { cotizacion: cost });
    toast({
      title: "Cotización actualizada",
      description: `Cotización establecida en $${cost.toLocaleString()}`,
    });
  };

  const handleAddComment = (serviceId: string) => {
    if (newComment.trim()) {
      addComment(serviceId, newComment, 'admin');
      setNewComment('');
      toast({
        title: "Comentario agregado",
        description: "El comentario se ha agregado exitosamente",
      });
    }
  };

  // Vista de lista de usuarios
  if (!selectedUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-glow">Panel Admin - Usuarios</h2>
            <p className="text-muted-foreground">Selecciona un usuario para gestionar sus servicios técnicos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUsers.map((user) => {
            const userServices = getUserServices(user.id);
            const activeServices = userServices.filter(s => s.estado !== 'entregado').length;
            
            return (
              <Card key={user.id} className="card-gaming border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
                    onClick={() => setSelectedUser(user)}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {userServices.length} servicios
                        </Badge>
                        {activeServices > 0 && (
                          <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                            {activeServices} activos
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Vista de detalle del usuario seleccionado
  const userServices = getUserServices(selectedUser.id);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedUser(null)}>
            ← Volver a usuarios
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-glow">Servicios de {selectedUser.name}</h2>
            <p className="text-muted-foreground">{selectedUser.email}</p>
          </div>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gaming">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden de Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="card-gaming border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-glow">Nueva Orden para {selectedUser.name}</DialogTitle>
              <DialogDescription>
                Registra un nuevo equipo para reparación o mantenimiento
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateService)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Problema</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe el problema del equipo..."
                          className="bg-background/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="btn-gaming flex-1">
                    <Wrench className="h-4 w-4 mr-2" />
                    Crear Servicio
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-gaming border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Recibidos</p>
                <p className="text-2xl font-bold">
                  {services.filter(s => s.estado === 'recibido').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-gaming border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">En Proceso</p>
                <p className="text-2xl font-bold">
                  {services.filter(s => ['diagnostico', 'reparando'].includes(s.estado)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-gaming border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold">
                  {services.filter(s => s.estado === 'completado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-gaming border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Entregados</p>
                <p className="text-2xl font-bold">
                  {services.filter(s => s.estado === 'entregado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List for selected user */}
      <div className="space-y-4">
        {userServices.length === 0 ? (
          <Card className="card-gaming border-primary/20">
            <CardContent className="p-8 text-center">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay servicios para este usuario</h3>
              <p className="text-muted-foreground">
                Crea la primera orden de servicio para {selectedUser.name}
              </p>
            </CardContent>
          </Card>
        ) : (
          userServices.map((service) => (
            <Card key={service.id} className="card-gaming border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {getStatusIcon(service.estado)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">#{service.id.slice(-6)}</CardTitle>
                      <CardDescription>{service.clienteName}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(service.estado)}>
                    {getStatusText(service.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{service.descripcion}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Creado:</span>
                    <p>{format(new Date(service.fechaCreacion), 'dd MMM yyyy', { locale: es })}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actualizado:</span>
                    <p>{format(new Date(service.fechaActualizacion), 'dd MMM yyyy', { locale: es })}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select onValueChange={(value) => handleStatusUpdate(service.id, value as TechnicalService['estado'])}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recibido">Recibido</SelectItem>
                      <SelectItem value="diagnostico">En Diagnóstico</SelectItem>
                      <SelectItem value="esperando_aprobacion">Esperando Aprobación</SelectItem>
                      <SelectItem value="reparando">Reparando</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>

                  {!service.cotizacion && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCostUpdate(service.id, 50000)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Agregar Cotización
                    </Button>
                  )}
                </div>

                {service.cotizacion && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-bold text-primary">
                        ${service.cotizacion.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Comentarios ({service.comentarios.length})
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {service.comentarios.slice(-2).map((comment) => (
                      <div key={comment.id} className="text-xs p-2 rounded bg-muted/30">
                        <span className="font-medium capitalize">{comment.autor}:</span> {comment.texto}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar comentario..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="text-sm"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddComment(service.id)}
                      disabled={!newComment.trim()}
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TechnicalServicesAdmin;