import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'cliente' | 'user' | 'superadmin' | 'employee';
  points: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const isSuperadmin = () => profile?.role === 'superadmin';
  const isAdmin = () => profile?.role === 'admin';
  const isManager = () => profile?.role === 'manager' || profile?.role === 'employee';
  
  // Admin can create and edit (no delete)
  const canCreateContent = () => isAdmin() || isSuperadmin() || isManager();
  const canEditContent = () => isAdmin() || isSuperadmin() || isManager();
  
  // Only superadmin can delete
  const canDeleteContent = () => isSuperadmin();
  
  // Legacy function for backward compatibility
  const canManageProducts = () => canCreateContent();

  return {
    profile,
    loading,
    error,
    isSuperadmin,
    isAdmin,
    isManager,
    canCreateContent,
    canEditContent,
    canDeleteContent,
    canManageProducts,
  };
};