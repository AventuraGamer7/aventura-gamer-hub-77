import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface GamificationEvent {
  type: 'points' | 'levelUp';
  value: number;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentEvent, setCurrentEvent] = useState<GamificationEvent | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const calculateLevel = (points: number): number => {
    // Level formula: Level = floor(points / 100) + 1
    return Math.floor(points / 100) + 1;
  };

  const addPoints = async (points: number, reason: string) => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para ganar puntos',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Get current profile
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('points, level')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const oldPoints = currentProfile.points;
      const oldLevel = currentProfile.level;
      const newPoints = oldPoints + points;
      const newLevel = calculateLevel(newPoints);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          points: newPoints,
          level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Show points animation
      setCurrentEvent({ type: 'points', value: points });

      // Check if leveled up
      if (newLevel > oldLevel) {
        setTimeout(() => {
          setCurrentEvent({ type: 'levelUp', value: newLevel });
          toast({
            title: '🎮 ¡Nivel mejorado!',
            description: `¡Has alcanzado el nivel ${newLevel}!`,
          });
        }, 3000);
      }

      // Refresh profile
      await fetchProfile();

      toast({
        title: `+${points} XP`,
        description: reason,
      });
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron agregar los puntos',
        variant: 'destructive',
      });
    }
  };

  const clearCurrentEvent = () => {
    setCurrentEvent(null);
  };

  return {
    profile,
    currentEvent,
    addPoints,
    clearCurrentEvent,
    calculateLevel,
  };
};
