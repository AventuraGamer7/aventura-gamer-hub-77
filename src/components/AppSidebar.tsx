import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  useSidebar 
} from '@/components/ui/sidebar';
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
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  sidebarItems,
  activeSection,
  setActiveSection,
  handleLogout,
  navigate
}) => {
  const { open } = useSidebar();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className={`p-6 border-b border-border/50 ${!open ? 'px-3' : ''}`}>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              🎮
            </Badge>
            {open && (
              <>
                <button 
                  onClick={() => navigate('/')} 
                  className="font-bold text-neon hover:text-primary transition-colors"
                >
                  Aventura Gamer
                </button>
              </>
            )}
          </div>
          {open && (
            <p className="text-xs text-muted-foreground mt-1">Panel de Administración</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-6">
            <SidebarGroup>
              {open && (
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gestión Principal
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.filter(item => item.section === 'Gestión Principal').map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full"
                      >
                        {item.icon}
                        {open && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              {open && (
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Otros
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.filter(item => item.section === 'Otros').map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => setActiveSection(item.id)}
                        isActive={activeSection === item.id}
                        className="w-full"
                      >
                        {item.icon}
                        {open && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={`p-4 border-t border-border/50 space-y-2 ${!open ? 'px-3' : ''}`}>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className={`${!open ? 'w-10 h-10 p-0' : 'w-full'} justify-center bg-destructive/20 border-destructive/30 text-destructive hover:bg-destructive/30`}
          >
            <LogOut className={`h-4 w-4 ${!open ? '' : 'mr-2'}`} />
            {open && 'Cerrar Sesión'}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};