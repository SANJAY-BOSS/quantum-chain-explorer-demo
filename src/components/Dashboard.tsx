
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlockchain } from '../contexts/BlockchainContext';
import { useUserRole } from '../hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Activity, 
  Database, 
  Users, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface UserStats {
  totalRecords: number;
  verifiedRecords: number;
  pendingRecords: number;
  integrityScore: number;
}

interface AuditActivity {
  id: string;
  action_type: string;
  success: boolean;
  timestamp: string;
  hash_verified: string | null;
}

const Dashboard: React.FC = () => {
  const { state, user } = useBlockchain();
  const { role, hasRole } = useUserRole();
  const [userStats, setUserStats] = useState<UserStats>({
    totalRecords: 0,
    verifiedRecords: 0,
    pendingRecords: 0,
    integrityScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<AuditActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load user records
      const { data: records, error: recordsError } = await supabase
        .from('data_records')
        .select('*')
        .eq('user_id', user.id);

      if (recordsError) throw recordsError;

      // Load recent activity
      const { data: activity, error: activityError } = await supabase
        .from('blockchain_audit')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (activityError) throw activityError;

      // Calculate stats
      const totalRecords = records?.length || 0;
      const verifiedRecords = records?.filter(r => r.blockchain_verified).length || 0;
      const pendingRecords = totalRecords - verifiedRecords;
      const integrityScore = totalRecords > 0 ? Math.round((verifiedRecords / totalRecords) * 100) : 100;

      setUserStats({
        totalRecords,
        verifiedRecords,
        pendingRecords,
        integrityScore,
      });

      setRecentActivity(activity || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntegrityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Add safety checks for blockchain state
  if (!state || !state.chain || !Array.isArray(state.chain)) {
    console.warn('Blockchain state is not properly initialized');
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Data Integrity Score */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Integrity Score</p>
                <p className={`text-3xl font-bold ${getIntegrityScoreColor(userStats.integrityScore).split(' ')[0]}`}>
                  {userStats.integrityScore}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <Badge className={`mt-2 ${getIntegrityScoreColor(userStats.integrityScore)}`}>
              {userStats.integrityScore >= 90 ? 'Excellent' : 
               userStats.integrityScore >= 75 ? 'Good' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>

        {/* Total Records */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.totalRecords}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">All data records</p>
          </CardContent>
        </Card>

        {/* Verified Records */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-green-600">{userStats.verifiedRecords}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Blockchain verified</p>
          </CardContent>
        </Card>

        {/* Pending Records */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{userStats.pendingRecords}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Stats (for admins) */}
      {hasRole('admin') && state && state.chain && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Network Blocks</p>
                  <p className="text-2xl font-bold text-green-700">{state.totalBlocks || state.chain.length}</p>
                </div>
                <Database className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-purple-700">{state.totalTransactions || 0}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Security Mode</p>
                  <p className="text-sm font-semibold text-orange-700">
                    {state.cryptoMode === 'post-quantum' ? 'Post-Quantum' : 'Classical'}
                  </p>
                </div>
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {activity.action_type.replace('_', ' ')}
                      </p>
                      {activity.hash_verified && (
                        <p className="text-xs text-gray-500 font-mono">
                          Hash: {activity.hash_verified.substring(0, 16)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
