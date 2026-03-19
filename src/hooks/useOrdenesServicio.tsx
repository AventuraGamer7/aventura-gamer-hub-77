import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface Usuario {
  id: string;
  email: string;
  username?: string;
  role?: string;
}

export const useOrdenesServicio = () => {
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, username, role');

      if (error) throw error;

      const usuariosMap = profiles?.map(profile => ({
        id: profile.id,
        email: `usuario-${profile.id.slice(-6)}@email.com`, // Mock email temporalmente
        username: profile.username,
        role: profile.role
      })) || [];

      setUsuarios(usuariosMap);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive'
      });
    }
  };

  // Cargar todas las órdenes
  const fetchOrdenes = async () => {
    try {
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdenes(data || []);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las órdenes',
        variant: 'destructive'
      });
    }
  };

  // Cargar órdenes por usuario
  const fetchOrdenesByUsuario = async (usuarioId: string) => {
    try {
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .select('*')
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al cargar órdenes del usuario:', error);
      return [];
    }
  };

  // Crear nueva orden
  const crearOrden = async (usuarioId: string, descripcion: string) => {
    try {
      const { data, error } = await supabase
        .from('ordenes_servicio')
        .insert({
          usuario_id: usuarioId,
          descripcion,
          estado: 'Recibido'
        })
        .select()
        .single();

      if (error) throw error;

      setOrdenes(prev => [data, ...prev]);
      toast({
        title: 'Orden creada',
        description: 'La orden de servicio se creó exitosamente',
      });

      return data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la orden de servicio',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Actualizar estado de orden con descripción e imágenes del admin
  const actualizarEstadoOrden = async (ordenId: string, nuevoEstado: string, adminDescripcion?: string, adminImagenes?: string[]) => {
    try {
      const updateData: any = { estado: nuevoEstado };
      
      if (adminDescripcion !== undefined) {
        updateData.admin_descripcion = adminDescripcion;
      }
      
      if (adminImagenes !== undefined) {
        updateData.admin_imagenes = adminImagenes;
      }

      const { data, error } = await supabase
        .from('ordenes_servicio')
        .update(updateData)
        .eq('id', ordenId)
        .select()
        .single();

      if (error) throw error;

      setOrdenes(prev => prev.map(orden => 
        orden.id === ordenId ? { ...orden, ...updateData } : orden
      ));

      toast({
        title: 'Estado actualizado',
        description: `Estado cambiado a: ${nuevoEstado}`,
      });

      return data;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Subir imagen a Supabase Storage
  const subirImagen = async (file: File, ordenId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${ordenId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('service-orders')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('service-orders')
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive'
      });
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsuarios(), fetchOrdenes()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    ordenes,
    usuarios,
    loading,
    fetchOrdenesByUsuario,
    crearOrden,
    actualizarEstadoOrden,
    subirImagen,
    refetchData: () => Promise.all([fetchUsuarios(), fetchOrdenes()])
  };
};