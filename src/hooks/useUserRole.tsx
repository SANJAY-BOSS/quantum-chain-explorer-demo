
import { useState, useEffect } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { supabase } from '../integrations/supabase/client';

export type UserRole = 'admin' | 'user' | 'auditor';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useBlockchain();

  const fetchUserRole = async () => {
    if (!user) {
      setRole('user');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_user_role', {
        _user_id: user.id
      });

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } else {
        setRole(data || 'user');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setRole('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  const hasRole = (requiredRole: UserRole): boolean => {
    const roleHierarchy = { admin: 3, auditor: 2, user: 1 };
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const assignRole = async (userId: string, newRole: UserRole) => {
    if (!hasRole('admin')) {
      throw new Error('Only admins can assign roles');
    }

    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: newRole,
        assigned_by: user?.id
      });

    if (error) {
      throw error;
    }
  };

  return { 
    role, 
    loading, 
    hasRole, 
    assignRole,
    refetch: fetchUserRole
  };
};
