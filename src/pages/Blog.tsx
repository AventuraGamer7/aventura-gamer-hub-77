import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { 
  Calendar, 
  User, 
  Eye,
  ArrowRight,
  Gamepad2,
  Wrench,
  BookOpen,
  TrendingUp
} from 'lucide-react';

const Blog = () => {
  const featuredPost = {
    title: 'PlayStation 5: Guía Completa de Reparación y Mantenimiento 2024',
    excerpt: 'Todo lo que necesitas saber sobre el mantenimiento de tu PS5, desde limpieza básica hasta reparaciones avanzadas. Incluye consejos de nuestros expertos técnicos.',
    image: '/api/placeholder/800/400',
    author: 'Carlos Técnico',
    date: '15 Enero 2024',
    readTime: '8 min',
    views: '2.4k',
    category: 'Reparación',
    featured: true
  };

  const posts = [
    {
      title: 'Xbox Series X vs PS5: ¿Cuál es Más Fácil de Reparar?',
      excerpt: 'Comparamos la complejidad de reparación entre las consolas de nueva generación.',
      image: '/api/placeholder/400/250',
      author: 'Ana Gamer',
      date: '12 Enero 2024',
      readTime: '5 min',
      views: '1.8k',
      category: 'Comparativa',
      featured: false
    },
    {
      title: 'Nintendo Switch OLED: Problemas Comunes y Soluciones',
      excerpt: 'Los issues más frecuentes en la Switch OLED y cómo solucionarlos paso a paso.',
      image: '/api/placeholder/400/250',
      author: 'Miguel Experto',
      date: '10 Enero 2024',
      readTime: '6 min',
      views: '1.5k',
      category: 'Tutoriales',
      featured: false
    },
    {
      title: 'Drift en Joysticks: La Guía Definitiva de Prevención',
      excerpt: 'Aprende a prevenir y solucionar el temido drift en controles de todas las marcas.',
      image: '/api/placeholder/400/250',
      author: 'Laura Técnica',
      date: '8 Enero 2024',
      readTime: '7 min',
      views: '3.2k',
      category: 'Reparación',
      featured: false
    },
    {
      title: 'Tendencias Gaming 2024: Lo Que Viene Este Año',
      excerpt: 'Las nuevas tecnologías y tendencias que definirán el mundo gaming en 2024.',
      image: '/api/placeholder/400/250',
      author: 'Roberto Analista',
      date: '5 Enero 2024',
      readTime: '4 min',
      views: '2.1k',
      category: 'Noticias',
      featured: false
    },
    {
      title: 'Herramientas Esenciales para Reparación de Consolas',
      excerpt: 'El kit completo de herramientas que todo reparador de consolas debe tener.',
      image: '/api/placeholder/400/250',
      author: 'Pedro Maestro',
      date: '3 Enero 2024',
      readTime: '6 min',
      views: '1.9k',
      category: 'Herramientas',
      featured: false
    },
    {
      title: 'Cómo Iniciar tu Negocio de Reparación Gaming',
      excerpt: 'Consejos y estrategias para emprender en el mundo de la reparación de consolas.',
      image: '/api/placeholder/400/250',
      author: 'Sofia Emprendedora',
      date: '1 Enero 2024',
      readTime: '9 min',
      views: '2.7k',
      category: 'Negocios',
      featured: false
    }
  ];

  const categories = [
    { name: 'Reparación', icon: <Wrench className="h-4 w-4" />, count: 15 },
    { name: 'Tutoriales', icon: <BookOpen className="h-4 w-4" />, count: 12 },
    { name: 'Noticias', icon: <TrendingUp className="h-4 w-4" />, count: 8 },
    { name: 'Comparativas', icon: <Gamepad2 className="h-4 w-4" />, count: 6 },
    { name: 'Herramientas', icon: <Wrench className="h-4 w-4" />, count: 4 },
    { name: 'Negocios', icon: <TrendingUp className="h-4 w-4" />, count: 3 }
  ];

  const PostCard = ({ post }: { post: typeof posts[0] }) => (
    <Card className="card-gaming border-primary/20 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 bg-primary/90">
          {post.category}
        </Badge>
      </div>
      
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg text-neon line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.date}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views}
            </div>
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <Button variant="gaming" className="w-full group">
          Leer Más
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WhatsAppFloat />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-pink/10 via-background to-primary/10" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-gaming-pink/20 text-gaming-pink border-gaming-pink/30">
              📰 Blog Gamer
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-glow">
              Noticias & Tutoriales
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mantente al día con las últimas noticias gaming, tutoriales de reparación y consejos de nuestros expertos.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Artículo Destacado</h2>
            <Card className="card-gaming border-primary/20 overflow-hidden group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary/90">
                    Destacado
                  </Badge>
                </div>
                
                <div className="p-8 flex flex-col justify-center space-y-6">
                  <Badge variant="secondary" className="w-fit">
                    {featuredPost.category}
                  </Badge>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-glow">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-lg">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {featuredPost.views}
                      </div>
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  
                  <Button variant="hero" size="lg" className="w-full group">
                    Leer Artículo Completo
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="card-gaming border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Categorías</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-gaming border-secondary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Suscríbete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Recibe las últimas noticias y tutoriales directo en tu email.
                  </p>
                  <Button variant="gaming" className="w-full">
                    Suscribirse
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Últimos Artículos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post, index) => (
                  <PostCard key={index} post={post} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="gaming-secondary" size="lg">
                  Cargar Más Artículos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;