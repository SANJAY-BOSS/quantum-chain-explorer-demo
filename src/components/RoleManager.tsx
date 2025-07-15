import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Eye } from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
}

const RoleManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasRole, assignRole } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      // Get user emails from auth metadata (this is a simplified approach)
      const usersWithRoles = userRoles?.map(ur => ({
        id: ur.user_id,
        email: `user-${ur.user_id.substring(0, 8)}@example.com`, // Placeholder
        role: ur.role as UserRole
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await assignRole(userId, newRole);
      toast({
        title: "Role Updated",
        description: `User role successfully updated to ${newRole}`,
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'auditor':
        return <Eye className="w-4 h-4 text-yellow-500" />;
      default:
        return <User className="w-4 h-4 text-blue-500" />;
    }
  };

  if (!hasRole('admin')) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            You don't have permission to manage user roles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Role Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getRoleIcon(user.role)}
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">ID: {user.id.substring(0, 8)}...</p>
                  </div>
                </div>
                <Select
                  value={user.role}
                  onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="auditor">Auditor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No users found.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleManager;