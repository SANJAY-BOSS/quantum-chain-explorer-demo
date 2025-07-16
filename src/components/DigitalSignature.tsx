import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, FileText, Shield, User, Calendar, Hash } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { toast } from '@/hooks/use-toast';

interface SignatureData {
  id: string;
  documentTitle: string;
  documentHash: string;
  signerName: string;
  signerEmail: string;
  signatureType: 'digital' | 'electronic' | 'biometric';
  timestamp: string;
  status: 'pending' | 'signed' | 'rejected';
  compliance: string[];
  blockchainTxId?: string;
}

const DigitalSignature = () => {
  const { user, addTransaction } = useBlockchain();
  const [loading, setLoading] = useState(false);
  const [signatures, setSignatures] = useState<SignatureData[]>([
    {
      id: '1',
      documentTitle: 'Employment Contract - John Doe',
      documentHash: 'sha256:a1b2c3d4e5f6...',
      signerName: 'John Doe',
      signerEmail: 'john.doe@company.com',
      signatureType: 'digital',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'signed',
      compliance: ['eIDAS', 'ESIGN Act', '21 CFR Part 11'],
      blockchainTxId: 'tx_abc123def456'
    },
    {
      id: '2',
      documentTitle: 'Medical Consent Form - Patient 12345',
      documentHash: 'sha256:b2c3d4e5f6g7...',
      signerName: 'Jane Smith',
      signerEmail: 'jane.smith@hospital.com',
      signatureType: 'biometric',
      timestamp: '2024-01-15T14:15:00Z',
      status: 'pending',
      compliance: ['HIPAA', 'FDA 21 CFR Part 11']
    }
  ]);

  // Form state
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signatureType, setSignatureType] = useState<'digital' | 'electronic' | 'biometric'>('digital');
  const [showSignatureForm, setShowSignatureForm] = useState(false);

  const handleCreateSignatureRequest = async () => {
    if (!documentTitle || !documentContent || !signerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create document hash
      const documentHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(documentContent));
      const hashArray = Array.from(new Uint8Array(documentHash));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Create signature request
      const newSignature: SignatureData = {
        id: Date.now().toString(),
        documentTitle,
        documentHash: `sha256:${hashHex.substring(0, 16)}...`,
        signerName: signerEmail.split('@')[0],
        signerEmail,
        signatureType,
        timestamp: new Date().toISOString(),
        status: 'pending',
        compliance: getComplianceForType(signatureType)
      };

      // Add to blockchain
      const txId = await addTransaction({
        sender: user?.email || 'system',
        dataHash: `signature_request_${newSignature.id}`,
        data: JSON.stringify({
          type: 'signature_request',
          documentTitle,
          documentHash: newSignature.documentHash,
          signerEmail,
          signatureType
        }),
        signature: `digital_signature_${Date.now()}`,
        cryptoAlgorithm: 'post-quantum'
      });

      newSignature.blockchainTxId = txId;
      setSignatures([newSignature, ...signatures]);

      toast({
        title: "Success",
        description: "Signature request created and recorded on blockchain",
      });

      // Reset form
      setDocumentTitle('');
      setDocumentContent('');
      setSignerEmail('');
      setSignatureType('digital');
      setShowSignatureForm(false);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create signature request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getComplianceForType = (type: string): string[] => {
    switch (type) {
      case 'digital':
        return ['eIDAS', 'ESIGN Act', 'UETA'];
      case 'electronic':
        return ['ESIGN Act', 'UETA'];
      case 'biometric':
        return ['21 CFR Part 11', 'HIPAA', 'ISO 19794'];
      default:
        return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digital Signature Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-600">
                Create, track, and manage digital signatures with blockchain verification
              </p>
            </div>
            <Button onClick={() => setShowSignatureForm(!showSignatureForm)}>
              Create Signature Request
            </Button>
          </div>

          {showSignatureForm && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="documentTitle">Document Title</Label>
                    <Input
                      id="documentTitle"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Enter document title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signerEmail">Signer Email</Label>
                    <Input
                      id="signerEmail"
                      type="email"
                      value={signerEmail}
                      onChange={(e) => setSignerEmail(e.target.value)}
                      placeholder="signer@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signatureType">Signature Type</Label>
                    <Select value={signatureType} onValueChange={(value: any) => setSignatureType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select signature type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="digital">Digital Signature</SelectItem>
                        <SelectItem value="electronic">Electronic Signature</SelectItem>
                        <SelectItem value="biometric">Biometric Signature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="documentContent">Document Content</Label>
                  <Textarea
                    id="documentContent"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    placeholder="Enter document content or upload file"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleCreateSignatureRequest}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Request'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSignatureForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {signatures.map((signature) => (
              <Card key={signature.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{signature.documentTitle}</h3>
                        <Badge className={getStatusColor(signature.status)}>
                          {getStatusIcon(signature.status)}
                          <span className="ml-1 capitalize">{signature.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{signature.signerName} ({signature.signerEmail})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(signature.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className="capitalize">{signature.signatureType} signature</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          <span className="font-mono text-xs">{signature.documentHash}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {signature.compliance.map((comp, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>

                      {signature.blockchainTxId && (
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>Blockchain TX: {signature.blockchainTxId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalSignature;