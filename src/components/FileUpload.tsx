
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, CheckCircle, XCircle } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { calculateHash } from '../utils/blockchain';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileProcessed?: (fileData: { name: string; hash: string; size: number }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    name: string;
    hash: string;
    size: number;
    status: 'success' | 'error';
  }[]>([]);

  const { addTransaction, state } = useBlockchain();

  const handleFileUpload = async (files: FileList) => {
    setProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Read file content
        const fileContent = await readFileAsText(file);
        
        // Generate hash
        const fileHash = calculateHash(fileContent + file.name + file.size);
        
        // Add to blockchain
        await addTransaction({
          sender: 'File Upload System',
          dataHash: fileHash,
          data: `File: ${file.name} (${formatFileSize(file.size)})`,
          signature: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          cryptoAlgorithm: state.cryptoMode === 'post-quantum' ? 'CRYSTALS-Dilithium-5' : 'ECDSA-P256',
        });

        const fileData = {
          name: file.name,
          hash: fileHash,
          size: file.size,
          status: 'success' as const,
        };

        setUploadedFiles(prev => [...prev, fileData]);
        
        if (onFileProcessed) {
          onFileProcessed(fileData);
        }

        toast({
          title: "File Processed",
          description: `${file.name} has been hashed and added to blockchain`,
        });

      } catch (error) {
        console.error('Error processing file:', error);
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          hash: '',
          size: file.size,
          status: 'error',
        }]);

        toast({
          title: "Error",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        });
      }
    }
    
    setProcessing(false);
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload & Hash Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Files will be hashed and committed to the blockchain
          </p>
          
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" disabled={processing}>
              {processing ? 'Processing...' : 'Select Files'}
            </Button>
          </Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Processed Files:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'success' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-mono text-gray-500">
                        {file.hash.substring(0, 8)}...
                      </span>
                    </>
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
