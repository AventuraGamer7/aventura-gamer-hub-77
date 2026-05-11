import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import { TechnicalServicesProvider } from "./hooks/useTechnicalServices";
import { GamificationProvider } from "./components/GamificationProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy-loaded routes (code-splitting) — keep landing + auth eager.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Servicios = lazy(() => import("./pages/Servicios"));
const Cursos = lazy(() => import("./pages/Cursos"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const Tienda = lazy(() => import("./pages/Tienda"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Carrito = lazy(() => import("./pages/Carrito"));
const Blog = lazy(() => import("./pages/Blog"));
const Contacto = lazy(() => import("./pages/Contacto"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TechnicalServicesDashboard = lazy(() => import("./pages/TechnicalServicesDashboard"));
const TechnicalServicesAdmin = lazy(() => import("./pages/TechnicalServicesAdmin"));
const ServiciosSpecific = lazy(() => import("./pages/ServiciosSpecific"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const SolicitarServicio = lazy(() => import("./pages/SolicitarServicio"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GamificationProvider>
        <CartProvider>
          <TechnicalServicesProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
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
              <Route path="/servicio/:id" element={<ServiceDetails />} />
              <Route path="/solicitar-servicio" element={<SolicitarServicio />} />
              <Route path="/servicios/:categoria" element={<Servicios />} />
              <Route path="/servicios/reparacion-playstation" element={<ServiciosSpecific />} />
              <Route path="/servicios/reparacion-xbox" element={<ServiciosSpecific />} />
              <Route path="/servicios/reparacion-nintendo" element={<ServiciosSpecific />} />
              <Route path="/sitemap.xml" element={<Sitemap />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/cursos/:categoria" element={<Cursos />} />
              <Route path="/curso/:id" element={<CourseDetails />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/tienda/:categoria" element={<Tienda />} />
          <Route path="/tienda/:categoria/:plataforma" element={<Tienda />} />
          <Route path="/producto/:slug" element={<ProductDetails />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/privacidad" element={<Privacidad />} />
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
            </Suspense>
            </BrowserRouter>
            </TooltipProvider>
          </TechnicalServicesProvider>
        </CartProvider>
      </GamificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
