
import { useState } from 'react';
import { Search, CheckCircle, XCircle, Hash, Clock, User, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '../contexts/BlockchainContext';
import { Transaction } from '../types/blockchain';

const VerifyData = () => {
  const [searchHash, setSearchHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    transaction?: Transaction;
    blockIndex?: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { verifyData, state } = useBlockchain();
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchHash.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a data hash to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundTransaction = verifyData(searchHash.trim());
      
      if (foundTransaction) {
        // Find which block contains this transaction
        const blockIndex = state.chain.findIndex(block => 
          block.transactions.some(tx => tx.dataHash === searchHash.trim())
        );
        
        setVerificationResult({
          found: true,
          transaction: foundTransaction,
          blockIndex,
        });
        
        toast({
          title: "Data Verified",
          description: "Your data hash was found on the blockchain.",
        });
      } else {
        setVerificationResult({
          found: false,
        });
        
        toast({
          title: "Data Not Found",
          description: "The provided hash was not found on the blockchain.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "There was an error during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const recentHashes = state.chain
    .flatMap(block => block.transactions)
    .slice(-5)
    .map(tx => ({
      hash: tx.dataHash,
      sender: tx.sender,
      timestamp: tx.timestamp,
    }));

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Verify Data Integrity
          </h1>
          <p className="text-lg text-gray-600">
            Validate that your data exists on the blockchain by searching for its cryptographic hash
          </p>
        </div>

        {/* Network Stats */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-700">{state.totalBlocks}</div>
                <div className="text-sm text-green-600">Blocks Searchable</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">{state.totalTransactions}</div>
                <div className="text-sm text-green-600">Transactions Stored</div>
              </div>
              <div>
                <Badge className="bg-green-100 text-green-800">
                  {state.cryptoMode === 'post-quantum' ? 'Post-Quantum Security' : 'Classical Security'}
                </Badge>
                <div className="text-sm text-green-600 mt-1">Current Mode</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verification Form */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <Search className="h-6 w-6 mr-2" />
                Verify Data Hash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <Label htmlFor="hash">Data Hash *</Label>
                  <Input
                    id="hash"
                    type="text"
                    placeholder="Enter the data hash you want to verify..."
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="mt-1 font-mono text-sm"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This should be the hash you received when submitting data
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How Verification Works</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We search all blocks in the blockchain</li>
                    <li>• Your hash is compared against stored data hashes</li>
                    <li>• If found, we return the original transaction details</li>
                    <li>• Cryptographic integrity ensures tamper-proof verification</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Search className="w-4 h-4 mr-2 animate-spin" />
                      Searching Blockchain...
                    </>
                  ) : (
                    <>
                      <Hash className="w-4 h-4 mr-2" />
                      Verify Hash
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Hashes */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Transaction Hashes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentHashes.length > 0 ? (
                  recentHashes.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">Hash:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchHash(item.hash)}
                          className="text-xs"
                        >
                          Use This Hash
                        </Button>
                      </div>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all mb-2">
                        {item.hash}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>From: {item.sender}</span>
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No transactions found. Submit data to see hashes here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <Card className={`mt-8 ${verificationResult.found ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-semibold flex items-center ${verificationResult.found ? 'text-green-800' : 'text-red-800'}`}>
                {verificationResult.found ? (
                  <>
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Data Verified Successfully
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 mr-2" />
                    Data Not Found
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {verificationResult.found && verificationResult.transaction ? (
                <div className="space-y-6">
                  {/* Transaction Details */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Transaction ID:</span>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                          {verificationResult.transaction.id}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Block Index:</span>
                        <p className="text-gray-900 mt-1">#{verificationResult.blockIndex}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Sender:</span>
                        <p className="text-gray-900 mt-1 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {verificationResult.transaction.sender}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Timestamp:</span>
                        <p className="text-gray-900 mt-1 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTimestamp(verificationResult.transaction.timestamp)}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Cryptographic Signature:</span>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                          {verificationResult.transaction.signature}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Algorithm Used:</span>
                        <p className="text-gray-900 mt-1 flex items-center">
                          <Shield className="h-4 w-4 mr-1" />
                          {verificationResult.transaction.cryptoAlgorithm}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Original Data */}
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Data</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap break-words">
                        {verificationResult.transaction.data}
                      </p>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="bg-green-100 p-4 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Verification Complete</span>
                    </div>
                    <p className="text-green-700 text-sm mt-2">
                      This data hash exists on the blockchain and has been cryptographically verified.
                      The data integrity is guaranteed by the quantum-resistant security mechanisms.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border">
                  <div className="text-center">
                    <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Hash Not Found</h3>
                    <p className="text-red-600 mb-4">
                      The provided hash does not exist in our blockchain database.
                    </p>
                    <div className="text-left bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Possible Reasons:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• The hash was entered incorrectly</li>
                        <li>• The data was never submitted to this blockchain</li>
                        <li>• The transaction is still pending (not yet mined)</li>
                        <li>• The hash format is not recognized</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerifyData;
