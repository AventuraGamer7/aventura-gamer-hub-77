import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trophy, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const GamificationPanel = () => {
  const [userLevel] = useState(7);
  const [userXP] = useState(1250);
  const [nextLevelXP] = useState(1500);
  const [totalPoints] = useState(8650);

  const achievements: Achievement[] = [
    {
      id: 'first-repair',
      title: 'Primer Aventurero',
      description: 'Realizaste tu primera reparación',
      icon: <Target className="h-4 w-4" />,
      unlocked: true,
    },
    {
      id: 'course-master',
      title: 'Maestro del Conocimiento',
      description: 'Completaste 3 cursos',
      icon: <Trophy className="h-4 w-4" />,
      unlocked: true,
      progress: 3,
      maxProgress: 3,
    },
    {
      id: 'shopping-spree',
      title: 'Coleccionista de Repuestos',
      description: 'Compraste 10 repuestos diferentes',
      icon: <Star className="h-4 w-4" />,
      unlocked: false,
      progress: 7,
      maxProgress: 10,
    },
    {
      id: 'level-master',
      title: 'Aventurero Élite',
      description: 'Alcanza el nivel 10',
      icon: <Zap className="h-4 w-4" />,
      unlocked: false,
      progress: userLevel,
      maxProgress: 10,
    },
  ];

  const xpProgress = (userXP / nextLevelXP) * 100;

  return (
    <Card className="card-gaming border-primary/20 w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-neon flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Tu Progreso Aventurero
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level and XP */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Nivel {userLevel}</span>
            <span className="text-sm text-muted-foreground">
              {userXP}/{nextLevelXP} XP
            </span>
          </div>
          <div className="xp-bar h-2">
            <div 
              className="xp-fill h-full" 
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Total Points */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
          <span className="text-sm">Puntos Totales</span>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {totalPoints.toLocaleString()} pts
          </Badge>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-secondary">Logros Recientes</h4>
          <div className="grid gap-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  achievement.unlocked
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-muted/30 border border-muted'
                }`}
              >
                <div
                  className={`p-1.5 rounded-full ${
                    achievement.unlocked
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${
                    achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mt-1">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationPanel;