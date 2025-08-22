import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import ManagementPanel from '@/components/ManagementPanel';
import HeroManagementPanel from '@/components/HeroManagementPanel';
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
  Monitor
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { profile, canCreateContent, isSuperadmin, isAdmin } = useProfile();
  const { products } = useProducts();
  const { courses } = useCourses();
  const { services } = useServices();
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

  const sidebarItems = [
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
    {
      id: 'users',
      title: 'Usuarios',
      icon: <Users className="h-5 w-5" />,
      section: 'Otros'
    },
    {
      id: 'config',
      title: 'Configuración',
      icon: <Settings className="h-5 w-5" />,
      section: 'Otros'
    }
  ];

  const stats = [
    {
      title: 'Total Cursos',
      value: courses.length,
      subtitle: 'Cursos activos',
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
      subtitle: 'Servicios ofrecidos',
      icon: <Wrench className="h-6 w-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Usuarios',
      value: 324,
      subtitle: 'Usuarios registrados',
      icon: <Users className="h-6 w-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const quickActions = [
    {
      title: 'Gestionar Cursos',
      description: 'Agregar, editar o eliminar cursos',
      icon: <GraduationCap className="h-8 w-8" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      action: () => setActiveSection('courses')
    },
    {
      title: 'Gestionar Productos',
      description: 'Administrar inventario y precios',
      icon: <Package className="h-8 w-8" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      action: () => setActiveSection('products')
    },
    {
      title: 'Gestionar Servicios',
      description: 'Configurar servicios técnicos',
      icon: <Wrench className="h-8 w-8" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      action: () => setActiveSection('services')
    }
  ];

  const recentActivity = [
    {
      action: 'Nuevo curso "Valorant Pro" agregado',
      time: 'Hace 2 horas',
      icon: <Plus className="h-4 w-4" />
    },
    {
      action: 'Producto "Teclado Gaming RGB" actualizado',
      time: 'Hace 5 horas',
      icon: <Edit className="h-4 w-4" />
    },
    {
      action: 'Servicio de reparación completado',
      time: 'Hace 1 día',
      icon: <Wrench className="h-4 w-4" />
    }
  ];

  const renderMainContent = () => {
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
            <ManagementPanel type="courses" />
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
            <ManagementPanel type="products" />
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
      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-glow">Gestión de Usuarios</h2>
              <p className="text-muted-foreground">Administra los usuarios del sistema</p>
            </div>
            <Card className="card-gaming border-primary/20">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Funcionalidad en desarrollo</p>
              </CardContent>
            </Card>
          </div>
        );
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
                    <Card key={index} className="card-gaming border-primary/20 glow-hover cursor-pointer" onClick={action.action}>
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

            {/* Recent Activity */}
            <Card className="card-gaming border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="text-primary">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border/50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              🎮
            </Badge>
            <span className="font-bold text-neon">Aventura Gamer</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Panel de Administración</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Gestión Principal
              </p>
              <div className="space-y-1">
                {sidebarItems.filter(item => item.section === 'Gestión Principal').map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Otros
              </p>
              <div className="space-y-1">
                {sidebarItems.filter(item => item.section === 'Otros').map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full justify-start border-border/50"
          >
            <Home className="mr-2 h-4 w-4" />
            Volver al Sitio
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full justify-start bg-destructive/20 border-destructive/30 text-destructive hover:bg-destructive/30"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card/30 border-b border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-glow">Panel de Control</h1>
              <p className="text-muted-foreground">Gestiona todos los aspectos de Aventura Gamer desde aquí</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                <Clock className="mr-1 h-3 w-3" />
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="xl:col-span-3">
                {renderMainContent()}
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                <GamificationPanel />
                
                {/* Quick Stats */}
                <Card className="card-gaming border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Productos activos</span>
                      <span className="font-bold">{products.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cursos disponibles</span>
                      <span className="font-bold">{courses.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Servicios ofrecidos</span>
                      <span className="font-bold">{services.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;