
import { useState, useEffect } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';

export type UserRole = 'admin' | 'user' | 'auditor';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useBlockchain();

  useEffect(() => {
    if (user) {
      // Temporary implementation - assign admin role to first user for demo
      // This will be replaced once user_roles table is created
      setRole('admin');
    } else {
      setRole('user');
    }
    setLoading(false);
  }, [user]);

  const hasRole = (requiredRole: UserRole): boolean => {
    const roleHierarchy = { admin: 3, auditor: 2, user: 1 };
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  return { 
    role, 
    loading, 
    hasRole, 
    refetch: () => {
      // Placeholder refetch function
      setLoading(true);
      setTimeout(() => setLoading(false), 100);
    }
  };
};
