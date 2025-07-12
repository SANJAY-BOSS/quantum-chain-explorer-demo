
import { useState } from 'react';
import { Settings, Zap, RotateCcw, Shield, Database, Clock, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '../contexts/BlockchainContext';
import { verifyBlockchain } from '../utils/blockchain';

const AdminDashboard = () => {
  const [autoMining, setAutoMining] = useState(true);
  const { state, mineBlock, resetChain, toggleCryptoMode } = useBlockchain();
  const { toast } = useToast();

  const handleMineBlock = () => {
    if (state.pendingTransactions.length === 0) {
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

  const systemStats = [
    {
      title: "Total Blocks",
      value: state.totalBlocks,
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Transactions",
      value: state.totalTransactions,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Transactions",
      value: state.pendingTransactions.length,
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

  const recentBlocks = [...state.chain].reverse().slice(0, 5);

  const formatTimestamp = (timestamp: number) => {
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
                  disabled={state.isming || state.pendingTransactions.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {state.isming ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Mining in Progress...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Mine New Block ({state.pendingTransactions.length} pending)
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
                {recentBlocks.map((block) => (
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
                        <span className="font-mono">{block.hash.substring(0, 12)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transactions:</span>
                        <span>{block.transactions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Validator:</span>
                        <span>{block.validator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Consensus:</span>
                        <span className="text-xs">{block.consensusAlgorithm}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
