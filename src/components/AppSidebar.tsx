import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';

interface AppSidebarProps {
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
  isCollapsed: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  sidebarItems,
  activeSection,
  setActiveSection,
  handleLogout,
  navigate,
  isCollapsed
}) => {
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border/50 flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className={`p-6 border-b border-border/50 ${isCollapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            🎮
          </Badge>
          {!isCollapsed && (
            <button 
              onClick={() => navigate('/')} 
              className="font-bold text-neon hover:text-primary transition-colors"
            >
              Aventura Gamer
            </button>
          )}
        </div>
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground mt-1">Panel de Administración</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Gestión Principal
              </p>
            )}
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
                  title={isCollapsed ? item.title : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Otros
              </p>
            )}
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
                  title={isCollapsed ? item.title : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={`p-4 border-t border-border/50 space-y-2 ${isCollapsed ? 'px-3' : ''}`}>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className={`${isCollapsed ? 'w-10 h-10 p-0' : 'w-full'} justify-center bg-destructive/20 border-destructive/30 text-destructive hover:bg-destructive/30`}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && 'Cerrar Sesión'}
        </Button>
      </div>
    </div>
  );
};