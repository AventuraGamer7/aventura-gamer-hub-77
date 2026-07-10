import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEOHead from '@/components/SEO/SEOHead';
import CourseCard from '@/components/CourseCard';
import { useCourses } from '@/hooks/useCourses';
import { generateCourseSchema, getSEOKeywords } from '@/utils/seoUtils';
import { Award, Target, CheckCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'reparacion', label: 'Reparación' },
  { id: 'mantenimiento', label: 'Mantenimiento' },
  { id: 'avanzado', label: 'Avanzado' },
  { id: 'basico', label: 'Básico' },
];

const FILTERS: Record<string, string[]> = {
  reparacion: ['reparación', 'reparar', 'arreglo', 'fix'],
  mantenimiento: ['mantenimiento', 'limpieza', 'cuidado', 'maintenance'],
  avanzado: ['avanzado', 'profesional', 'expert', 'master'],
  basico: ['básico', 'inicio', 'principiante', 'beginner'],
};

const BENEFITS = [
  { title: 'Instructores Expertos', description: 'Aprende de técnicos con más de 8 años de experiencia', icon: Award },
  { title: 'Práctica Real', description: 'Trabajarás con equipos reales desde el primer día', icon: Target },
  { title: 'Certificación', description: 'Recibe un certificado avalado al completar el curso', icon: CheckCircle },
  { title: 'Soporte Continuo', description: 'Acceso a nuestra comunidad y soporte post-curso', icon: Users },
];

const Cursos = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses();

  const activeCategory = categoria || 'todos';

  const filteredCourses = React.useMemo(() => {
    if (activeCategory === 'todos') return courses;
    const keys = FILTERS[activeCategory] || [];
    return courses.filter((c) =>
      keys.some(
        (k) =>
          c.title.toLowerCase().includes(k) ||
          c.description?.toLowerCase().includes(k)
      )
    );
  }, [courses, activeCategory]);

  const seoMap: Record<string, { title: string; description: string; keywords: string }> = {
    reparacion: {
      title: 'Cursos de Reparación de Consolas Gaming | Academia Aventura Gamer',
      description: 'Aprende reparación profesional de PlayStation, Xbox y Nintendo. Cursos presenciales con práctica real, certificación incluida en Envigado.',
      keywords: getSEOKeywords('cursos'),
    },
    mantenimiento: {
      title: 'Cursos de Mantenimiento Gaming - Consolas y Controles | Aventura Gamer',
      description: 'Formación en mantenimiento preventivo gaming: limpieza, pasta térmica, ventiladores. Técnicas profesionales en Envigado.',
      keywords: 'curso mantenimiento gaming, limpieza consolas, pasta térmica, ventiladores gaming Envigado',
    },
    avanzado: {
      title: 'Cursos Avanzados Reparación Gaming - Nivel Profesional | Aventura Gamer',
      description: 'Cursos avanzados para técnicos: microsoldadura, reballing, reparación de placas. Nivel profesional con certificación en Envigado.',
      keywords: 'cursos avanzados gaming, microsoldadura consolas, reballing PlayStation Xbox, técnico profesional Envigado',
    },
    todos: {
      title: 'Cursos de Reparación Gaming - Academia Técnica | Aventura Gamer',
      description: 'Academia especializada en cursos de reparación de consolas gaming. PlayStation, Xbox, Nintendo. Certificación, práctica real y soporte continuo.',
      keywords: getSEOKeywords('cursos'),
    },
  };
  const seoData = seoMap[activeCategory] || seoMap.todos;
  const canonicalUrl = `https://aventuragamer.com/cursos${categoria ? `/${categoria}` : ''}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cursos de Reparación Gaming',
    description: seoData.description,
    itemListElement: courses.slice(0, 5).map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateCourseSchema(course),
    })),
  };

  const handleCategoryChange = (id: string) => {
    if (id === 'todos') navigate('/cursos');
    else navigate(`/cursos/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={canonicalUrl}
        type="website"
        structuredData={structuredData}
      />
      <Header />
      <WhatsAppFloat />

      {/* Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-glow">
              Academia Gamer · Cursos Especializados
            </h1>
            <p className="text-lg text-muted-foreground">
              Conviértete en un maestro de la reparación gaming. Aprende con los mejores y domina las técnicas más avanzadas.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 border-y border-border/40 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{b.title}</div>
                  <div className="text-xs text-muted-foreground">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-12">
        <div className="container mx-auto px-4 space-y-6">
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Error al cargar los cursos: {error}</p>
              <Button variant="gaming" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay cursos disponibles en esta categoría.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cursos;
