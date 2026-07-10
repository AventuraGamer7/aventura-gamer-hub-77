import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, ShoppingCart, Clock, Users, Award, TrendingUp } from 'lucide-react';

interface CourseCardProps {
  course: any;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const goTo = () => navigate(`/curso/${course.id}`);

  return (
    <Card
      className="card-gaming border-primary/20 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex flex-col"
      onClick={goTo}
    >
      {course.cover ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={course.cover}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          {course.level && (
            <Badge className="absolute top-3 left-3 capitalize" variant="secondary">
              <TrendingUp className="mr-1 h-3 w-3" />
              {course.level}
            </Badge>
          )}
          {course.has_certification && (
            <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
              <Award className="mr-1 h-3 w-3" />
              Certificado
            </Badge>
          )}
        </div>
      ) : (
        <div className="relative h-44 bg-primary/10 flex items-center justify-center">
          <GraduationCap className="h-12 w-12 text-primary/30" />
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-neon line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description || 'Curso especializado con certificación al finalizar.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration_weeks || 4} sem
          </span>
          {course.estimated_students > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.estimated_students}+ alumnos
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <div className="text-xs text-muted-foreground">Precio</div>
            <div className="text-xl font-bold text-primary">{formatPrice(course.price)}</div>
          </div>
          <Button
            variant="gaming"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                id: course.id,
                name: course.title,
                price: course.price,
                image: course.cover || undefined,
                type: 'course',
              });
              toast({
                title: 'Curso agregado',
                description: `${course.title} se agregó al carrito`,
              });
            }}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Inscribirse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
