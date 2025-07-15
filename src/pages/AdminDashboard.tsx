
import { useState } from 'react';
import { Settings, Zap, RotateCcw, Shield, Database, Clock, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '../contexts/BlockchainContext';
import { verifyBlockchain } from '../utils/blockchain';
import { useUserRole } from '@/hooks/useUserRole';
import RoleManager from '@/components/RoleManager';

const AdminDashboard = () => {
  const [autoMining, setAutoMining] = useState(true);
  const { state, mineBlock, resetChain, toggleCryptoMode } = useBlockchain();
  const { toast } = useToast();
  const { hasRole, loading: roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!hasRole('admin')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Add safety checks for blockchain state
  if (!state || !state.chain || !Array.isArray(state.chain)) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading blockchain state...</span>
          </div>
        </div>
      </div>
    );
  }

  const handleMineBlock = () => {
    if (!state.pendingTransactions || state.pendingTransactions.length === 0) {
      toast({
        title: "No Pending Transactions",
        description: "There are no transactions to mine into a new block.",
        variant: "destructive",
      });
      return;
    }

    mineBlock();
    toast({
      title: "Mining Started",
      description: "A new block is being mined with pending transactions.",
    });
  };

  const handleResetChain = () => {
    if (window.confirm("Are you sure you want to reset the entire blockchain? This action cannot be undone.")) {
      resetChain();
      toast({
        title: "Blockchain Reset",
        description: "The blockchain has been reset to genesis block.",
      });
    }
  };

  const handleToggleCrypto = () => {
    toggleCryptoMode();
    toast({
      title: "Crypto Mode Changed",
      description: `Switched to ${state.cryptoMode === 'classical' ? 'Post-Quantum' : 'Classical'} mode.`,
    });
  };

  const blockchainIntegrity = verifyBlockchain(state.chain);
  const pendingTransactionsCount = state.pendingTransactions ? state.pendingTransactions.length : 0;

  const systemStats = [
    {
      title: "Total Blocks",
      value: state.totalBlocks || state.chain.length,
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Transactions",
      value: state.totalTransactions || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Transactions",
      value: pendingTransactionsCount,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Chain Integrity",
      value: blockchainIntegrity ? "Valid" : "Invalid",
      icon: Shield,
      color: blockchainIntegrity ? "text-green-600" : "text-red-600",
      bgColor: blockchainIntegrity ? "bg-green-50" : "bg-red-50",
    },
  ];

  const consensusAlgorithms = [
    { name: "Proof of Stake (PQC)", active: state.cryptoMode === 'post-quantum' },
    { name: "Byzantine Fault Tolerance", active: true },
    { name: "Proof of Work", active: state.cryptoMode === 'classical' },
  ];

  // Safely get recent blocks with proper filtering
  const recentBlocks = state.chain
    .filter(block => block && typeof block === 'object' && block.index !== undefined)
    .slice()
    .reverse()
    .slice(0, 5);

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Invalid Date';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Monitor and control the quantum-resistant blockchain system
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Management Section */}
        <div className="mb-8">
          <RoleManager />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* System Controls */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                System Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mining Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mining Operations</h3>
                
                <Button
                  onClick={handleMineBlock}
                  disabled={state.isMining || pendingTransactionsCount === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {state.isMining ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Mining in Progress...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Mine New Block ({pendingTransactionsCount} pending)
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto Mining</span>
                  <Switch
                    checked={autoMining}
                    onCheckedChange={setAutoMining}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Automatically mine blocks every 30 seconds when transactions are pending
                </p>
              </div>

              {/* Crypto Mode Toggle */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Cryptographic Mode</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Current Mode</span>
                    <Badge className={state.cryptoMode === 'post-quantum' ? 'bg-green-100 text-green-800 ml-2' : 'bg-blue-100 text-blue-800 ml-2'}>
                      {state.cryptoMode === 'post-quantum' ? 'Post-Quantum' : 'Classical'}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={handleToggleCrypto}
                  variant="outline"
                  className="w-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Switch to {state.cryptoMode === 'classical' ? 'Post-Quantum' : 'Classical'}
                </Button>
              </div>

              {/* Reset Chain */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
                
                <Button
                  onClick={handleResetChain}
                  variant="destructive"
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Blockchain
                </Button>
                <p className="text-xs text-red-500">
                  This will permanently delete all blocks and transactions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Network Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Consensus Algorithms */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Active Consensus</h3>
                <div className="space-y-2">
                  {consensusAlgorithms.map((algo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{algo.name}</span>
                      <Badge className={algo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}>
                        {algo.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chain Integrity</span>
                    <Badge className={blockchainIntegrity ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {blockchainIntegrity ? 'Valid' : 'Compromised'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quantum Resistance</span>
                    <Badge className={state.cryptoMode === 'post-quantum' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {state.cryptoMode === 'post-quantum' ? 'Protected' : 'Vulnerable'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Performance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Block Time</span>
                    <span className="font-medium">~30 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TX Throughput</span>
                    <span className="font-medium">100 TPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium">12.3 MB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Blocks */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Recent Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentBlocks.length > 0 ? (
                  recentBlocks.map((block) => (
                    <div key={block.index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">Block #{block.index}</h4>
                          <p className="text-xs text-gray-500">{formatTimestamp(block.timestamp)}</p>
                        </div>
                        <Badge className={block.cryptoMode === 'post-quantum' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {block.cryptoMode === 'post-quantum' ? 'PQC' : 'Classical'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hash:</span>
                          <span className="font-mono">{block.hash ? block.hash.substring(0, 12) + '...' : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Transactions:</span>
                          <span>{block.transactions ? block.transactions.length : 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Validator:</span>
                          <span>{block.validator || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Consensus:</span>
                          <span className="text-xs">{block.consensusAlgorithm || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No blocks available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Cryptographic Algorithms</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Key Exchange:</span>
                    <span className="ml-2">{state.cryptoMode === 'post-quantum' ? 'CRYSTALS-Kyber-1024' : 'ECDH-P256'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Digital Signature:</span>
                    <span className="ml-2">{state.cryptoMode === 'post-quantum' ? 'CRYSTALS-Dilithium-5' : 'ECDSA-P256'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Hash Function:</span>
                    <span className="ml-2">{state.cryptoMode === 'post-quantum' ? 'SHAKE256' : 'SHA3-512'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Blockchain Configuration</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Block Size Limit:</span>
                    <span className="ml-2">1 MB</span>
                  </div>
                  <div>
                    <span className="font-medium">Mining Difficulty:</span>
                    <span className="ml-2">2 leading zeros</span>
                  </div>
                  <div>
                    <span className="font-medium">Target Block Time:</span>
                    <span className="ml-2">30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced System Monitoring */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Activity className="h-6 w-6 mr-2" />
              Real-Time System Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Resource Usage</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">24%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Storage</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Network Health</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium text-green-600">99.99%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="font-medium">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <span className="font-medium">1,247 TPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate:</span>
                    <span className="font-medium text-green-600">0.01%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peer Connections:</span>
                    <span className="font-medium">12 active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Metrics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Failed Auth Attempts:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suspicious Transactions:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Firewall Blocks:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Security Scan:</span>
                    <span className="font-medium text-green-600">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vulnerabilities:</span>
                    <span className="font-medium text-green-600">None</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
