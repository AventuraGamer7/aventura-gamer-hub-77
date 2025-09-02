import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import { TechnicalServicesProvider } from "./hooks/useTechnicalServices";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Servicios from "./pages/Servicios";
import Cursos from "./pages/Cursos";
import Tienda from "./pages/Tienda";
import ProductDetails from "./pages/ProductDetails";
import Carrito from "./pages/Carrito";
import Blog from "./pages/Blog";
import Contacto from "./pages/Contacto";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import NotFound from "./pages/NotFound";
import TechnicalServicesDashboard from "./pages/TechnicalServicesDashboard";
import TechnicalServicesAdmin from "./pages/TechnicalServicesAdmin";
import ServiciosSpecific from "./pages/ServiciosSpecific";
import Sitemap from "./pages/Sitemap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TechnicalServicesProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/usuarios" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRoute allowedRoles={['admin', 'superadmin', 'employee']}>
                      <UserManagement />
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/servicios/:categoria" element={<Servicios />} />
              <Route path="/servicios/reparacion-playstation" element={<ServiciosSpecific />} />
              <Route path="/servicios/reparacion-xbox" element={<ServiciosSpecific />} />
              <Route path="/servicios/reparacion-nintendo" element={<ServiciosSpecific />} />
              <Route path="/sitemap.xml" element={<Sitemap />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/cursos/:categoria" element={<Cursos />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/tienda/:categoria" element={<Tienda />} />
          <Route path="/producto/:id" element={<ProductDetails />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              <Route path="/payment/pending" element={<PaymentFailure />} />
              <Route 
                path="/servicios-tecnicos" 
                element={
                  <ProtectedRoute>
                    <TechnicalServicesDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/servicios-tecnicos" 
                element={
                  <ProtectedRoute>
                    <TechnicalServicesAdmin />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </TechnicalServicesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
