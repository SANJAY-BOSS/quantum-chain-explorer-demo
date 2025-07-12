
import { useState } from 'react';
import { Clock, Hash, User, Database, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Block, Transaction } from '../types/blockchain';

const Explorer = () => {
  const { state } = useBlockchain();
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatHash = (hash: string, length = 16) => {
    return `${hash.substring(0, length)}...`;
  };

  const getCryptoModeColor = (mode: string) => {
    return mode === 'post-quantum' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Blockchain Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Explore blocks, transactions, and cryptographic details of the quantum-resistant blockchain
          </p>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Blocks</p>
                  <p className="text-2xl font-bold text-gray-900">{state.totalBlocks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Hash className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{state.totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Crypto Mode</p>
                  <Badge className={getCryptoModeColor(state.cryptoMode)}>
                    {state.cryptoMode === 'post-quantum' ? 'Post-Quantum' : 'Classical'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={state.isMining ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {state.isMining ? 'Mining' : 'Active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Transactions */}
        {state.pendingTransactions.length > 0 && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-yellow-800">
                Pending Transactions ({state.pendingTransactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.pendingTransactions.map((tx) => (
                  <div key={tx.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">{formatHash(tx.id)}</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      From: {tx.sender} | Data: {formatHash(tx.dataHash)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Blocks List */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Recent Blocks</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {[...state.chain].reverse().map((block) => (
                  <div
                    key={block.index}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedBlock?.index === block.index
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">Block #{block.index}</h3>
                        <p className="text-sm text-gray-500">{formatTimestamp(block.timestamp)}</p>
                      </div>
                      <Badge className={getCryptoModeColor(block.cryptoMode)}>
                        {block.cryptoMode === 'post-quantum' ? 'PQC' : 'Classical'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Hash:</span> <span className="font-mono">{formatHash(block.hash)}</span></p>
                      <p><span className="text-gray-500">Transactions:</span> {block.transactions.length}</p>
                      <p><span className="text-gray-500">Validator:</span> {block.validator}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Block Details */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {selectedBlock ? `Block #${selectedBlock.index} Details` : 'Select a Block'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBlock ? (
                <div className="space-y-6">
                  {/* Block Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Block Information</h4>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Index:</span>
                        <span className="font-mono">{selectedBlock.index}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Timestamp:</span>
                        <span>{formatTimestamp(selectedBlock.timestamp)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hash:</span>
                        <span className="font-mono text-xs break-all">{selectedBlock.hash}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Previous Hash:</span>
                        <span className="font-mono text-xs break-all">{selectedBlock.previousHash}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Merkle Root:</span>
                        <span className="font-mono text-xs break-all">{selectedBlock.merkleRoot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Nonce:</span>
                        <span className="font-mono">{selectedBlock.nonce}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Validator:</span>
                        <span>{selectedBlock.validator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Consensus:</span>
                        <span>{selectedBlock.consensusAlgorithm}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">
                      Transactions ({selectedBlock.transactions.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedBlock.transactions.map((tx) => (
                        <div key={tx.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-mono text-sm">{formatHash(tx.id)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedTransaction(
                                expandedTransaction === tx.id ? null : tx.id
                              )}
                            >
                              {expandedTransaction === tx.id ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                          </div>
                          
                          {expandedTransaction === tx.id && (
                            <div className="space-y-2 text-sm border-t pt-2">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Sender:</span>
                                <span>{tx.sender}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Data Hash:</span>
                                <span className="font-mono text-xs">{tx.dataHash}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Signature:</span>
                                <span className="font-mono text-xs">{formatHash(tx.signature, 12)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Algorithm:</span>
                                <span>{tx.cryptoAlgorithm}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Timestamp:</span>
                                <span>{formatTimestamp(tx.timestamp)}</span>
                              </div>
                              <div className="mt-2">
                                <span className="text-gray-500">Data:</span>
                                <p className="mt-1 p-2 bg-gray-50 rounded text-xs break-words">{tx.data}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a block to view its details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
