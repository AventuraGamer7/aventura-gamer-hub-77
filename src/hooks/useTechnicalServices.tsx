import { useState, useEffect, createContext, useContext } from 'react';

interface TechnicalService {
  id: string;
  clienteId: string;
  clienteName: string;
  estado: 'recibido' | 'diagnostico' | 'esperando_aprobacion' | 'reparando' | 'completado' | 'entregado';
  descripcion: string;
  imagenes: string[];
  cotizacion?: number;
  comentarios: {
    id: string;
    texto: string;
    fecha: string;
    autor: 'admin' | 'cliente';
  }[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface TechnicalServicesContextType {
  services: TechnicalService[];
  loading: boolean;
  createService: (serviceData: Omit<TechnicalService, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'comentarios' | 'estado'>) => void;
  updateService: (id: string, updates: Partial<TechnicalService>) => void;
  getServicesByClient: (clienteId: string) => TechnicalService[];
  addComment: (serviceId: string, texto: string, autor: 'admin' | 'cliente') => void;
}

const TechnicalServicesContext = createContext<TechnicalServicesContextType | undefined>(undefined);

// Mock data para usuarios
const mockUsers = [
  { id: 'user-1', name: 'Juan Pérez', email: 'juan@email.com' },
  { id: 'user-2', name: 'María García', email: 'maria@email.com' },
  { id: 'user-3', name: 'Carlos López', email: 'carlos@email.com' },
];

// Mock data inicial
const initialServices: TechnicalService[] = [
  {
    id: 'service-1',
    clienteId: 'user-1',
    clienteName: 'Juan Pérez',
    estado: 'recibido',
    descripcion: 'PS5 no enciende, posible problema con fuente de poder',
    imagenes: ['/placeholder.svg'],
    comentarios: [
      {
        id: 'comment-1',
        texto: 'Equipo recibido en perfectas condiciones externas',
        fecha: new Date().toISOString(),
        autor: 'admin'
      }
    ],
    fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date().toISOString()
  },
  {
    id: 'service-2',
    clienteId: 'user-2',
    clienteName: 'María García',
    estado: 'diagnostico',
    descripcion: 'Control de Xbox con drift en joystick izquierdo',
    imagenes: [],
    cotizacion: 45000,
    comentarios: [
      {
        id: 'comment-2',
        texto: 'Confirmado problema de drift. Requiere cambio de potenciómetro.',
        fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        autor: 'admin'
      }
    ],
    fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const TechnicalServicesProvider = ({ children }: { children: React.ReactNode }) => {
  const [services, setServices] = useState<TechnicalService[]>(initialServices);
  const [loading, setLoading] = useState(false);

  const createService = (serviceData: Omit<TechnicalService, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'comentarios' | 'estado'>) => {
    const newService: TechnicalService = {
      ...serviceData,
      id: `service-${Date.now()}`,
      estado: 'recibido',
      comentarios: [
        {
          id: `comment-${Date.now()}`,
          texto: 'Servicio creado y equipo recibido',
          fecha: new Date().toISOString(),
          autor: 'admin'
        }
      ],
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updates: Partial<TechnicalService>) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { ...service, ...updates, fechaActualizacion: new Date().toISOString() }
        : service
    ));
  };

  const getServicesByClient = (clienteId: string) => {
    return services.filter(service => service.clienteId === clienteId);
  };

  const addComment = (serviceId: string, texto: string, autor: 'admin' | 'cliente') => {
    const newComment = {
      id: `comment-${Date.now()}`,
      texto,
      fecha: new Date().toISOString(),
      autor
    };

    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            comentarios: [...service.comentarios, newComment],
            fechaActualizacion: new Date().toISOString()
          }
        : service
    ));
  };

  const value = {
    services,
    loading,
    createService,
    updateService,
    getServicesByClient,
    addComment
  };

  return (
    <TechnicalServicesContext.Provider value={value}>
      {children}
    </TechnicalServicesContext.Provider>
  );
};

export const useTechnicalServices = () => {
  const context = useContext(TechnicalServicesContext);
  if (context === undefined) {
    throw new Error('useTechnicalServices must be used within a TechnicalServicesProvider');
  }
  return context;
};

export { mockUsers };
export type { TechnicalService };