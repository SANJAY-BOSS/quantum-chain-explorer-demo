
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBlockchain } from '../contexts/BlockchainContext';

export type UserRole = 'admin' | 'user' | 'auditor';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useBlockchain();

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setRole('user');
      setLoading(false);
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
      }

      setRole((data?.role as UserRole) || 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setRole('user');
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    const roleHierarchy = { admin: 3, auditor: 2, user: 1 };
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  return { role, loading, hasRole, refetch: fetchUserRole };
};
