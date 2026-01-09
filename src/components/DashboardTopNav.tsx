import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Home } from 'lucide-react';

interface DashboardTopNavProps {
  sidebarItems: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    section: string;
  }>;
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleLogout: () => void;
  navigate: (path: string) => void;
  userEmail?: string;
  userRole?: string;
}

export const DashboardTopNav: React.FC<DashboardTopNavProps> = ({
  sidebarItems,
  activeSection,
  setActiveSection,
  handleLogout,
  navigate,
  userEmail,
  userRole
}) => {
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'superadmin': return 'Superadmin';
      case 'admin': return 'Admin';
      case 'manager':
      case 'employee': return 'Manager';
      default: return 'Cliente';
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      {/* Top Bar - Logo, User Info, Actions */}
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-lg px-2">
              🎮
            </Badge>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              Aventura Gamer
            </span>
          </button>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 hidden md:flex">
            Panel de Control
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>{userEmail}</span>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary">
              {getRoleLabel(userRole)}
            </Badge>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="border-border/50"
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="bg-destructive/20 border-destructive/30 text-destructive hover:bg-destructive/30"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 lg:px-6 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
