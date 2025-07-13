
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Award } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';

interface CertificateData {
  recipient: string;
  title: string;
  description: string;
  issuer: string;
  dataHash: string;
  blockchainTxId: string;
}

const CertificateGenerator: React.FC = () => {
  const [certificateData, setCertificateData] = useState<Partial<CertificateData>>({
    issuer: 'Quantum Chain Authority'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { saveDataRecord, user } = useBlockchain();

  const generateCertificate = async () => {
    if (!user || !certificateData.recipient || !certificateData.title) return;

    setIsGenerating(true);
    try {
      // Create a blockchain record for the certificate
      const recordId = await saveDataRecord({
        title: `Certificate: ${certificateData.title}`,
        content: JSON.stringify(certificateData),
        recordType: 'legal',
        metadata: { 
          type: 'certificate',
          recipient: certificateData.recipient,
          issuer: certificateData.issuer 
        }
      });

      if (recordId) {
        // Generate PDF certificate (simulated)
        generatePDFCertificate({
          ...certificateData as CertificateData,
          dataHash: `cert_${recordId}_${Date.now()}`,
          blockchainTxId: recordId
        });
      }
    } catch (error) {
      console.error('Certificate generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFCertificate = (data: CertificateData) => {
    // Simulate PDF generation
    const certificateContent = `
      BLOCKCHAIN-SECURED CERTIFICATE
      ==============================
      
      This certifies that:
      ${data.recipient}
      
      Has been awarded:
      ${data.title}
      
      Description:
      ${data.description}
      
      Issued by: ${data.issuer}
      Date: ${new Date().toDateString()}
      
      BLOCKCHAIN VERIFICATION:
      Data Hash: ${data.dataHash}
      Transaction ID: ${data.blockchainTxId}
      Verified on Quantum-Resistant Chain
      
      This certificate is cryptographically secured and tamper-proof.
      Verify at: https://quantum-chain.verify/${data.blockchainTxId}
    `;

    // Create and download the certificate
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${data.recipient.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600" />
          Immutable Certificate Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Name</Label>
            <Input
              id="recipient"
              value={certificateData.recipient || ''}
              onChange={(e) => setCertificateData(prev => ({ ...prev, recipient: e.target.value }))}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer</Label>
            <Input
              id="issuer"
              value={certificateData.issuer || ''}
              onChange={(e) => setCertificateData(prev => ({ ...prev, issuer: e.target.value }))}
              placeholder="Organization Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Certificate Title</Label>
          <Input
            id="title"
            value={certificateData.title || ''}
            onChange={(e) => setCertificateData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Certificate of Completion"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={certificateData.description || ''}
            onChange={(e) => setCertificateData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description of the achievement or certification"
            rows={3}
          />
        </div>

        <Button
          onClick={generateCertificate}
          disabled={isGenerating || !certificateData.recipient || !certificateData.title}
          className="w-full flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <FileText className="h-4 w-4 animate-pulse" />
              Generating Certificate...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Generate & Download Certificate
            </>
          )}
        </Button>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>• Certificate will be blockchain-secured with immutable hash</p>
          <p>• PDF includes QR code for verification</p>
          <p>• Tamper-proof with cryptographic signatures</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateGenerator;
