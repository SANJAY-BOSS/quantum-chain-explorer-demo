
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBlockchain } from '../contexts/BlockchainContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, FileText, Shield, CheckCircle, XCircle, Eye, QrCode } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import QRCodeGenerator from '../components/QRCodeGenerator';

interface DataRecord {
  id: string;
  title: string;
  content: string;
  record_type: string;
  data_hash: string;
  blockchain_hash: string | null;
  blockchain_verified: boolean;
  created_at: string;
  metadata: any;
}

const EnhancedDataManager = () => {
  const { isAuthenticated, user, saveDataRecord, verifyDataIntegrity } = useBlockchain();
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataRecord | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recordType, setRecordType] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    loadRecords();
  }, [user]);

  const loadRecords = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('data_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error: any) {
      console.error('Failed to load records:', error);
      toast({
        title: "Error",
        description: "Failed to load your records",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recordId = await saveDataRecord({
        title,
        content,
        recordType,
        metadata: { created_from: 'enhanced_data_manager' },
      });

      if (recordId) {
        setTitle('');
        setContent('');
        setRecordType('');
        setShowForm(false);
        await loadRecords();
      }
    } catch (error) {
      console.error('Failed to save record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIntegrity = async (recordId: string) => {
    setLoading(true);
    try {
      const isValid = await verifyDataIntegrity(recordId);
      toast({
        title: isValid ? "Verification Successful" : "Verification Failed",
        description: isValid 
          ? "Data integrity verified on blockchain" 
          : "Data could not be verified on blockchain",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileProcessed = async (fileData: { name: string; hash: string; size: number }) => {
    // Automatically create a record for the uploaded file
    try {
      const recordId = await saveDataRecord({
        title: `File: ${fileData.name}`,
        content: `Uploaded file with hash: ${fileData.hash}`,
        recordType: 'document',
        metadata: { 
          file_name: fileData.name, 
          file_hash: fileData.hash, 
          file_size: fileData.size,
          created_from: 'file_upload' 
        },
      });

      if (recordId) {
        await loadRecords();
        toast({
          title: "File Record Created",
          description: `Created data record for ${fileData.name}`,
        });
      }
    } catch (error) {
      console.error('Failed to create file record:', error);
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors = {
      medical: 'bg-red-100 text-red-800',
      financial: 'bg-green-100 text-green-800',
      legal: 'bg-blue-100 text-blue-800',
      document: 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Enhanced Data Manager
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Store, verify, and manage your data with blockchain integrity and file upload support
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Record
          </Button>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload onFileProcessed={handleFileProcessed} />
        </div>

        {showForm && (
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle>Create New Data Record</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter record title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Record Type</Label>
                    <Select value={recordType} onValueChange={setRecordType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the content to be stored and hashed"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save & Add to Blockchain'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {records.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Records Yet</h3>
                <p className="text-gray-500 mb-4">Start by creating your first data record or uploading a file</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            records.map((record) => (
              <Card key={record.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{record.title}</h3>
                        <Badge className={getRecordTypeColor(record.record_type)}>
                          {record.record_type}
                        </Badge>
                        {record.blockchain_verified ? (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Created: {new Date(record.created_at).toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm font-mono">
                        Hash: {record.data_hash.substring(0, 32)}...
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecord(
                          selectedRecord?.id === record.id ? null : record
                        )}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyIntegrity(record.id)}
                        disabled={loading}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowQR(showQR === record.data_hash ? null : record.data_hash)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {selectedRecord?.id === record.id && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-2">Content:</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{record.content}</p>
                      </div>
                      {record.blockchain_hash && (
                        <div className="mt-3">
                          <h4 className="font-semibold mb-1">Blockchain Transaction ID:</h4>
                          <p className="text-sm font-mono text-blue-600">{record.blockchain_hash}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {showQR === record.data_hash && (
                    <div className="border-t pt-4 mt-4 flex justify-center">
                      <QRCodeGenerator 
                        value={record.data_hash} 
                        title="Data Hash QR Code"
                        size={200}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDataManager;
