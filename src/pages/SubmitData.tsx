
import { useState } from 'react';
import { Upload, Hash, Shield, CheckCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '../contexts/BlockchainContext';
import { generateDataHash, generatePQSignature } from '../utils/blockchain';

const SubmitData = () => {
  const [formData, setFormData] = useState({
    sender: '',
    data: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTransaction, setSubmittedTransaction] = useState<{
    id: string;
    hash: string;
    timestamp: number;
  } | null>(null);

  const { addTransaction, state } = useBlockchain();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sender.trim() || !formData.data.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate data hash using current crypto mode
      const dataHash = generateDataHash(formData.data, state.cryptoMode);
      
      // Generate signature
      const signature = generatePQSignature(formData.data + formData.sender, state.cryptoMode);
      
      // Get crypto algorithm based on current mode
      const cryptoAlgorithm = state.cryptoMode === 'post-quantum' 
        ? 'CRYSTALS-Dilithium-5' 
        : 'ECDSA-P256';

      // Add transaction to blockchain - await the Promise
      const transactionId = await addTransaction({
        sender: formData.sender,
        dataHash,
        data: formData.data,
        signature,
        cryptoAlgorithm,
      });

      setSubmittedTransaction({
        id: transactionId,
        hash: dataHash,
        timestamp: Date.now(),
      });

      toast({
        title: "Transaction Submitted Successfully",
        description: "Your data has been hashed and submitted to the blockchain.",
      });

      // Reset form
      setFormData({ sender: '', data: '' });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const exampleData = [
    {
      title: "Medical Record",
      data: "Patient ID: PAT001, Diagnosis: Routine Checkup, Date: 2024-01-15, Doctor: Dr. Smith",
    },
    {
      title: "Financial Transaction",
      data: "Transfer $1000 from Account A123 to Account B456 on 2024-01-15 at 14:30 UTC",
    },
    {
      title: "Legal Document",
      data: "Contract Agreement between Party A and Party B signed on 2024-01-15, Terms: Standard Service Agreement",
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Submit Data to Blockchain
          </h1>
          <p className="text-lg text-gray-600">
            Securely store your data on the quantum-resistant blockchain with cryptographic hashing
          </p>
        </div>

        {/* Current Network Status */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Network Status</h3>
                  <p className="text-sm text-blue-700">
                    {state.isMining ? 'Mining new block...' : 'Ready to accept transactions'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={state.cryptoMode === 'post-quantum' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                  {state.cryptoMode === 'post-quantum' ? 'Post-Quantum Mode' : 'Classical Mode'}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">
                  Pending: {state.pendingTransactions.length} transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit Form */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <Upload className="h-6 w-6 mr-2" />
                Submit New Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="sender">Sender Identity *</Label>
                  <Input
                    id="sender"
                    type="text"
                    placeholder="e.g., Organization Name, User ID, or Department"
                    value={formData.sender}
                    onChange={(e) => handleInputChange('sender', e.target.value)}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This identifies the source of the data being submitted
                  </p>
                </div>

                <div>
                  <Label htmlFor="data">Data to Submit *</Label>
                  <Textarea
                    id="data"
                    placeholder="Enter the data you want to store on the blockchain..."
                    value={formData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    rows={6}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your data will be cryptographically hashed before storage
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Security Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Hash Algorithm:</span> {state.cryptoMode === 'post-quantum' ? 'SHAKE256' : 'SHA3-512'}</p>
                    <p><span className="font-medium">Signature:</span> {state.cryptoMode === 'post-quantum' ? 'CRYSTALS-Dilithium-5' : 'ECDSA-P256'}</p>
                    <p><span className="font-medium">Current Mode:</span> {state.cryptoMode === 'post-quantum' ? 'Post-Quantum' : 'Classical'}</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <Hash className="w-4 h-4 mr-2" />
                      Submit to Blockchain
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Examples and Results */}
          <div className="space-y-6">
            {/* Transaction Result */}
            {submittedTransaction && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-green-800 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    Transaction Submitted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-green-700">Transaction ID:</span>
                      <p className="font-mono text-xs bg-white p-2 rounded mt-1 break-all">
                        {submittedTransaction.id}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Data Hash:</span>
                      <p className="font-mono text-xs bg-white p-2 rounded mt-1 break-all">
                        {submittedTransaction.hash}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Submitted:</span>
                      <p className="text-green-600">
                        {new Date(submittedTransaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded mt-4">
                      <p className="text-green-800 text-sm">
                        <strong>Save your data hash!</strong> You'll need it to verify your data later.
                        Your transaction is now pending and will be included in the next block.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Example Data */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Example Data Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exampleData.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{example.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{example.data}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('data', example.data)}
                      >
                        Use This Example
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Best Practices</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Include unique identifiers (IDs, timestamps)</li>
                    <li>• Be specific but avoid sensitive personal data</li>
                    <li>• Use consistent formatting for similar data types</li>
                    <li>• Keep data concise but meaningful</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitData;
