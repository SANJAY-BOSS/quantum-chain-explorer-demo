
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';

interface VerificationResult {
  isValid: boolean;
  hash: string;
  recordTitle?: string;
  timestamp?: string;
  blockchainTxId?: string;
}

const QRHashScanner: React.FC = () => {
  const [manualHash, setManualHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { verifyData } = useBlockchain();

  const verifyHash = async (hash: string) => {
    if (!hash.trim()) return;

    setIsVerifying(true);
    try {
      // Verify the hash in blockchain
      const transaction = verifyData(hash);
      
      if (transaction) {
        setVerificationResult({
          isValid: true,
          hash,
          recordTitle: transaction.data,
          timestamp: new Date(transaction.timestamp).toLocaleString(),
          blockchainTxId: transaction.id
        });
      } else {
        setVerificationResult({
          isValid: false,
          hash
        });
      }
    } catch (error) {
      console.error('Hash verification failed:', error);
      setVerificationResult({
        isValid: false,
        hash
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate QR code scanning from image
    // In a real implementation, you would use a QR code library like 'qr-scanner'
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulate extracting hash from QR code
      const simulatedHash = `qr_hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setManualHash(simulatedHash);
    };
    reader.readAsDataURL(file);
  };

  const startCameraScanning = () => {
    // Simulate camera QR scanning
    // In a real implementation, you would use camera access and QR scanning library
    const simulatedHash = `camera_hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setManualHash(simulatedHash);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-purple-600" />
          QR Hash Scanner & Verifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Hash Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manual-hash">Enter Hash Manually</Label>
            <Input
              id="manual-hash"
              value={manualHash}
              onChange={(e) => setManualHash(e.target.value)}
              placeholder="Enter cryptographic hash to verify"
              className="font-mono text-sm"
            />
          </div>

          <Button
            onClick={() => verifyHash(manualHash)}
            disabled={isVerifying || !manualHash.trim()}
            className="w-full"
          >
            {isVerifying ? 'Verifying...' : 'Verify Hash'}
          </Button>
        </div>

        {/* QR Code Scanning Options */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">QR Code Scanning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={startCameraScanning}
              className="flex items-center gap-2 h-20"
            >
              <Camera className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Scan with Camera</div>
                <div className="text-sm text-gray-500">Use device camera</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 h-20"
            >
              <Upload className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Upload QR Image</div>
                <div className="text-sm text-gray-500">Select from files</div>
              </div>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Verification Result</h3>
            <div className={`p-4 rounded-lg ${
              verificationResult.isValid 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {verificationResult.isValid ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      VERIFIED
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      INVALID
                    </Badge>
                  </>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Hash:</span>
                  <p className="font-mono text-xs break-all text-gray-600 dark:text-gray-400">
                    {verificationResult.hash}
                  </p>
                </div>

                {verificationResult.isValid && (
                  <>
                    {verificationResult.recordTitle && (
                      <div>
                        <span className="font-medium">Record:</span>
                        <p className="text-gray-600 dark:text-gray-400">{verificationResult.recordTitle}</p>
                      </div>
                    )}
                    {verificationResult.timestamp && (
                      <div>
                        <span className="font-medium">Timestamp:</span>
                        <p className="text-gray-600 dark:text-gray-400">{verificationResult.timestamp}</p>
                      </div>
                    )}
                    {verificationResult.blockchainTxId && (
                      <div>
                        <span className="font-medium">Transaction ID:</span>
                        <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                          {verificationResult.blockchainTxId}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRHashScanner;
