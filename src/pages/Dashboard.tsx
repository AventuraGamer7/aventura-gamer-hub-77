import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent, 
  SidebarTrigger, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  useSidebar 
} from '@/components/ui/sidebar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useProducts } from '@/hooks/useProducts';
import { useCourses } from '@/hooks/useCourses';
import { useServices } from '@/hooks/useServices';
import GamificationPanel from '@/components/GamificationPanel';
import AddProductForm from '@/components/AddProductForm';
import AddCourseForm from '@/components/AddCourseForm';
import AddServiceForm from '@/components/AddServiceForm';
import ProductManagementPanel from '@/components/ProductManagementPanel';
import ManagementPanel from '@/components/ManagementPanel';
import CourseManagementPanel from '@/components/CourseManagementPanel';
import HeroManagementPanel from '@/components/HeroManagementPanel';
import GestionUsuarios from '@/components/GestionUsuarios';
import { AppSidebar } from '@/components/AppSidebar';
import { CustomerOrders } from '@/components/CustomerOrders';
import OrdenesCliente from '@/components/OrdenesCliente';
import SalesManagementPanel from '@/components/SalesManagementPanel';
// Import customer orders hook
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { 
  LogOut, 
  User, 
  Trophy, 
  Star,
  ShoppingCart,
  Wrench,
  GraduationCap,
  Home,
  Settings,
  Users,
  BarChart3,
  Package,
  BookOpen,
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
  Clock,
  Monitor,
  Loader2,
  CheckCircle,
  Truck,
  DollarSign
} from 'lucide-react';

// Helper functions for status handling
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
    case 'processing':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    case 'shipped':
      return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
    case 'in_transit':
      return 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30';
    case 'out_for_delivery':
      return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    case 'delivered':
      return 'bg-green-500/20 text-green-600 border-green-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-600 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'Procesando';
    case 'shipped':
      return 'Enviado';
    case 'in_transit':
      return 'En tránsito';
    case 'out_for_delivery':
      return 'En reparto';
    case 'delivered':
      return 'Entregado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { profile, canCreateContent, isSuperadmin, isAdmin } = useProfile();
  const { products } = useProducts();
  const { courses } = useCourses();
  const { services } = useServices();
  const { orders, loading: ordersLoading } = useCustomerOrders();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "¡Hasta la próxima aventura!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive"
      });
    }
  };

  // Different sidebar items based on user role
  const sidebarItems = profile?.role === 'cliente' ? [
    {
      id: 'dashboard',
      title: 'Mi Panel',
      icon: <BarChart3 className="h-5 w-5" />,
      section: 'Principal'
    },
    {
      id: 'orders',
      title: 'Mis Pedidos',
      icon: <Package className="h-5 w-5" />,
      section: 'Principal'
    },
    {
      id: 'services',
      title: 'Mis Servicios',
      icon: <Wrench className="h-5 w-5" />,
      section: 'Principal'
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      icon: <User className="h-5 w-5" />,
      section: 'Principal'
    }
  ] : [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
      section: 'Gestión Principal'
    },
    {
      id: 'hero',
      title: 'Gestión del Hero',
      icon: <Monitor className="h-5 w-5" />,
      section: 'Gestión Principal'
    },
    {
      id: 'courses',
      title: 'Gestión Cursos',
      icon: <GraduationCap className="h-5 w-5" />,
      section: 'Gestión Principal'
    },
    {
      id: 'products',
      title: 'Gestión Productos',
      icon: <Package className="h-5 w-5" />,
      section: 'Gestión Principal'
    },
    {
      id: 'services',
      title: 'Gestión Servicios',
      icon: <Wrench className="h-5 w-5" />,
      section: 'Gestión Principal'
    },
    // Solo mostrar ventas para roles administrativos
    ...(profile && ['admin', 'superadmin', 'employee', 'manager'].includes(profile.role) ? [{
      id: 'sales',
      title: 'Ventas',
      icon: <DollarSign className="h-5 w-5" />,
      section: 'Gestión Principal'
    }] : []),
    // Solo mostrar usuarios para roles administrativos
    ...(profile && ['admin', 'superadmin', 'employee'].includes(profile.role) ? [{
      id: 'users',
      title: 'Usuarios',
      icon: <Users className="h-5 w-5" />,
      section: 'Otros'
    }] : []),
    {
      id: 'config',
      title: 'Configuración',
      icon: <Settings className="h-5 w-5" />,
      section: 'Otros'
    }
  ];

  // Different stats based on user role
  const stats = profile?.role === 'cliente' ? [
    {
      title: 'Puntos',
      value: profile?.points || 0,
      subtitle: `Nivel ${profile?.level || 1}`,
      icon: <Trophy className="h-6 w-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Mis Pedidos',
      value: orders.length,
      subtitle: 'Total de pedidos',
      icon: <Package className="h-6 w-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    }
  ] : [
    {
      title: 'Cursos',
      value: courses.length,
      subtitle: 'Disponibles',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Productos',
      value: products.length,
      subtitle: 'En inventario',
      icon: <Package className="h-6 w-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Servicios',
      value: services.length,
      subtitle: 'Ofrecidos',
      icon: <Wrench className="h-6 w-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    }
  ];

  const quickActions = [
    {
      title: 'Cursos',
      description: 'Gestionar cursos',
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      action: () => setActiveSection('courses')
    },
    {
      title: 'Productos',
      description: 'Gestionar inventario',
      icon: <Package className="h-6 w-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      action: () => setActiveSection('products')
    },
    {
      title: 'Servicios',
      description: 'Configurar servicios',
      icon: <Wrench className="h-6 w-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      action: () => setActiveSection('services')
    }
  ];


  const renderMainContent = () => {
    // Customer view
    if (profile?.role === 'cliente') {
      switch (activeSection) {
        case 'orders':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-glow">Mis Pedidos</h2>
                <p className="text-muted-foreground">Seguimiento de tus compras y envíos</p>
              </div>
              {ordersLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <CustomerOrders orders={orders} />
              )}
            </div>
          );
        case 'services':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-glow">Mis Servicios</h2>
                <p className="text-muted-foreground">Estado de tus órdenes de servicio técnico</p>
              </div>
              <OrdenesCliente />
            </div>
          );
        case 'profile':
          return (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-glow">Mi Perfil</h2>
                <p className="text-muted-foreground">Información de tu cuenta</p>
              </div>
              <Card className="card-gaming border-primary/20">
                <CardContent className="p-8 text-center">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Configuración de perfil próximamente</p>
                </CardContent>
              </Card>
            </div>
          );
        default:
          return (
            <div className="space-y-6">
              {/* Welcome Section for Customer */}
              <Card className="card-gaming border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-glow">
                        ¡Bienvenido, Aventurero!
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div>{user?.email}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                            Cliente Nivel {profile?.level || 1}
                          </span>
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {profile?.points || 0} puntos
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Gestiona tus pedidos, revisa el estado de tus envíos y descubre nuevas aventuras.
                  </p>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="card-gaming border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <div className={stat.color}>
                            {stat.icon}
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders Preview */}
              {orders.length > 0 && (
                <Card className="card-gaming border-primary/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-secondary" />
                      Pedidos Recientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {orders.slice(0, 2).map((order) => (
                        <Card key={order.id} className="bg-muted/30 border-0">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">#{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(order.created_at), 'dd MMM yyyy', { locale: es })}
                                </p>
                              </div>
                              <Badge className={getStatusColor(order.shipping_status)}>
                                {getStatusText(order.shipping_status)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {orders.length > 2 && (
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveSection('orders')}
                          className="w-full mt-3 text-primary hover:text-primary/80"
                        >
                          Ver todos ({orders.length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
      }
    }

    // Admin/Manager view (existing functionality)
    switch (activeSection) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-glow">Gestión del Hero</h2>
                <p className="text-muted-foreground">Administra los slides del carrusel principal</p>
              </div>
            </div>
            <HeroManagementPanel />
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-glow">Gestión de Cursos</h2>
                <p className="text-muted-foreground">Administra todos los cursos disponibles</p>
              </div>
              {canCreateContent() && <AddCourseForm />}
            </div>
            <CourseManagementPanel />
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-glow">Gestión de Productos</h2>
                <p className="text-muted-foreground">Administra el inventario y precios</p>
              </div>
              {canCreateContent() && <AddProductForm />}
            </div>
            <ProductManagementPanel />
          </div>
        );
      case 'services':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-glow">Gestión de Servicios</h2>
                <p className="text-muted-foreground">Configura los servicios técnicos</p>
              </div>
              {canCreateContent() && <AddServiceForm />}
            </div>
            <ManagementPanel type="services" />
          </div>
        );
      case 'sales':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-glow">Gestión de Ventas</h2>
              <p className="text-muted-foreground">Registra y visualiza el historial de ventas</p>
            </div>
            <SalesManagementPanel />
          </div>
        );
      case 'users':
        // Navegar a la página dedicada de gestión de usuarios
        navigate('/dashboard/usuarios');
        return null;
      case 'config':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-glow">Configuración</h2>
              <p className="text-muted-foreground">Ajustes del sistema</p>
            </div>
            <Card className="card-gaming border-primary/20">
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Funcionalidad en desarrollo</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="card-gaming border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-glow">
                      ¡Bienvenido, Aventurero!
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div>{user?.email}</div>
                      {profile && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {profile.role === 'superadmin' ? 'Superadmin' :
                             profile.role === 'admin' ? 'Admin' :
                             profile.role === 'manager' || profile.role === 'employee' ? 'Manager' : 
                             'Cliente'}
                          </span>
                        </div>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestiona todos los aspectos de Aventura Gamer desde este panel de control.
                </p>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="card-gaming border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <div className={stat.color}>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            {canCreateContent() && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-secondary">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="card-gaming border-primary/20 cursor-pointer" onClick={action.action}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${action.bgColor}`}>
                            <div className={action.color}>
                              {action.icon}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-neon">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                        <Button variant="gaming" size="sm" className="w-full mt-4">
                          Administrar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="card-gaming border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={action.action}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-3">
                      <div className={`p-3 rounded-full ${action.bgColor} mx-auto w-fit`}>
                        <div className={action.color}>
                          {action.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AppSidebar 
        sidebarItems={sidebarItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
        navigate={navigate}
        isCollapsed={isCollapsed}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card/30 border-b border-border/50 p-4 lg:p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-10 w-10 bg-primary hover:bg-primary/90 border-primary/50 text-primary-foreground shadow-lg transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-glow truncate">Panel de Control</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {profile?.role === 'cliente' ? 'Tu espacio personal de Aventura Gamer' : 'Gestiona todos los aspectos de Aventura Gamer'}
              </p>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="border-border/50 hidden sm:flex"
              >
                <Home className="mr-2 h-4 w-4" />
                Inicio
              </Button>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary hidden lg:flex">
                <Clock className="mr-1 h-3 w-3" />
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-3 lg:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {renderMainContent()}
              </div>

              {/* Sidebar Content - Only for admin users */}
              {profile?.role !== 'cliente' && (
                <div className="hidden lg:block w-72 space-y-6 flex-shrink-0">
                  <GamificationPanel />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;