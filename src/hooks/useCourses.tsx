import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  cover: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
  duration_weeks?: number;
  level?: string;
  estimated_students?: number;
  has_certification?: boolean;
  curriculum?: any[];
  requirements?: string[];
  includes?: string[];
  learning_outcomes?: string[];
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCourses((data || []).map(course => ({
        ...course,
        curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
        requirements: Array.isArray(course.requirements) ? course.requirements.filter(item => typeof item === 'string') : [],
        includes: Array.isArray(course.includes) ? course.includes.filter(item => typeof item === 'string') : [],
        learning_outcomes: Array.isArray(course.learning_outcomes) ? course.learning_outcomes.filter(item => typeof item === 'string') : []
      } as Course)));
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

    // Set up real-time subscription for course changes
    const subscription = supabase
      .channel('courses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses'
        },
        () => {
          fetchCourses();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { courses, loading, error, refetch: fetchCourses };
};