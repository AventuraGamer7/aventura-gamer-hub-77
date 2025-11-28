import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trophy, Target, Zap, ShoppingCart, Share2, Award, Crown, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  canClaim: boolean;
  claimed: boolean;
  xpReward: number;
  progress?: number;
  maxProgress?: number;
}

const GamificationPanel = () => {
  const { profile, loading } = useProfile();
  const [purchases, setPurchases] = useState(0);
  const [claimedAchievements, setClaimedAchievements] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      fetchUserPurchases();
    }
  }, [profile]);

  const fetchUserPurchases = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', profile.id);

      if (error) throw error;
      setPurchases(data?.length || 0);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  if (loading || !profile) {
    return (
      <Card className="card-gaming border-primary/20 w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const userLevel = profile.level || 1;
  const totalPoints = profile.points || 0;
  const nextLevelXP = (userLevel * 100);
  const currentLevelXP = ((userLevel - 1) * 100);
  const userXP = totalPoints - currentLevelXP;

  const achievements: Achievement[] = [
    {
      id: 'first-purchase',
      title: 'Primera Compra',
      description: 'Realiza tu primera compra en AventuraGamer',
      icon: <ShoppingCart className="h-4 w-4" />,
      unlocked: purchases >= 1,
      canClaim: purchases >= 1 && !claimedAchievements.includes('first-purchase'),
      claimed: claimedAchievements.includes('first-purchase'),
      xpReward: 50,
      progress: purchases,
      maxProgress: 1,
    },
    {
      id: 'level-3',
      title: 'Nivel 3 Alcanzado',
      description: 'Llega al nivel 3',
      icon: <Star className="h-4 w-4" />,
      unlocked: userLevel >= 3,
      canClaim: userLevel >= 3 && !claimedAchievements.includes('level-3'),
      claimed: claimedAchievements.includes('level-3'),
      xpReward: 100,
      progress: userLevel,
      maxProgress: 3,
    },
    {
      id: 'level-5',
      title: 'Rango ProGamer',
      description: 'Alcanza el nivel 5',
      icon: <Crown className="h-4 w-4" />,
      unlocked: userLevel >= 5,
      canClaim: userLevel >= 5 && !claimedAchievements.includes('level-5'),
      claimed: claimedAchievements.includes('level-5'),
      xpReward: 200,
      progress: userLevel,
      maxProgress: 5,
    },
    {
      id: 'big-spender',
      title: 'Gran Comprador',
      description: 'Realiza 5 compras',
      icon: <Trophy className="h-4 w-4" />,
      unlocked: purchases >= 5,
      canClaim: purchases >= 5 && !claimedAchievements.includes('big-spender'),
      claimed: claimedAchievements.includes('big-spender'),
      xpReward: 150,
      progress: purchases,
      maxProgress: 5,
    },
  ];

  const handleClaimReward = (achievementId: string, xpReward: number) => {
    setClaimedAchievements(prev => [...prev, achievementId]);
    toast({
      title: "¡Logro reclamado!",
      description: `Has ganado ${xpReward} XP Coins. ¡Sigue así, aventurero!`,
    });
  };

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
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-secondary">Logros y Desafíos</h4>
          <div className="grid gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative p-3 rounded-lg transition-all border ${
                  achievement.claimed
                    ? 'bg-green-500/10 border-green-500/30'
                    : achievement.unlocked
                    ? 'bg-primary/10 border-primary/20 shadow-sm'
                    : 'bg-muted/30 border-muted opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full transition-all ${
                      achievement.claimed
                        ? 'bg-green-500 text-white'
                        : achievement.unlocked
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {achievement.claimed ? <Trophy className="h-4 w-4" /> : achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${
                        achievement.claimed
                          ? 'text-green-600 dark:text-green-400'
                          : achievement.unlocked 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                        {achievement.claimed && (
                          <Badge className="ml-2 bg-green-500/20 text-green-600 border-green-500/30">
                            Completado
                          </Badge>
                        )}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        +{achievement.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    
                    {/* Progress Bar and Counter */}
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Progreso: {achievement.progress}/{achievement.maxProgress}
                          </span>
                          <span className="text-xs font-medium">
                            {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Action Button */}
                    {achievement.canClaim && (
                      <Button
                        size="sm"
                        onClick={() => handleClaimReward(achievement.id, achievement.xpReward)}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-md"
                      >
                        <Gift className="h-3 w-3 mr-1" />
                        Reclamar {achievement.xpReward} XP Coins
                      </Button>
                    )}

                    {achievement.claimed && (
                      <div className="text-center">
                        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                          ¡Recompensa reclamada!
                        </Badge>
                      </div>
                    )}

                    {!achievement.unlocked && !achievement.claimed && (
                      <div className="text-center">
                        <Badge variant="outline" className="text-muted-foreground">
                          Bloqueado
                        </Badge>
                      </div>
                    )}
                  </div>
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