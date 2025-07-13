
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, Shield } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { supabase } from '@/integrations/supabase/client';

interface TamperAlert {
  id: string;
  recordId: string;
  recordTitle: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const TamperDetectionSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<TamperAlert[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const { verifyDataIntegrity, user } = useBlockchain();

  useEffect(() => {
    // Auto-scan every 5 minutes
    const interval = setInterval(() => {
      if (user && !isScanning) {
        performTamperScan();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isScanning]);

  const performTamperScan = async () => {
    if (!user) return;

    setIsScanning(true);
    try {
      // Get all user records
      const { data: records, error } = await supabase
        .from('data_records')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const newAlerts: TamperAlert[] = [];

      // Verify each record
      for (const record of records || []) {
        try {
          const isValid = await verifyDataIntegrity(record.id);
          
          if (!isValid) {
            newAlerts.push({
              id: `alert_${record.id}_${Date.now()}`,
              recordId: record.id,
              recordTitle: record.title,
              detectedAt: new Date().toISOString(),
              severity: 'high',
              description: 'Hash mismatch detected between database and blockchain'
            });
          }
        } catch (error) {
          newAlerts.push({
            id: `alert_${record.id}_${Date.now()}`,
            recordId: record.id,
            recordTitle: record.title,
            detectedAt: new Date().toISOString(),
            severity: 'medium',
            description: 'Unable to verify record integrity'
          });
        }
      }

      setAlerts(prev => [...newAlerts, ...prev.slice(0, 50)]); // Keep last 50 alerts
      setLastScan(new Date());
    } catch (error) {
      console.error('Tamper scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          AI Tamper Detection System
        </CardTitle>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lastScan ? `Last scan: ${lastScan.toLocaleString()}` : 'Never scanned'}
          </p>
          <Button
            onClick={performTamperScan}
            disabled={isScanning}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Now'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No tampering detected</p>
            <p className="text-sm text-gray-500">All records are secure</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-red-600">{alerts.length} Alert(s) Detected</span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{alert.recordTitle}</h4>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {alert.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Detected: {new Date(alert.detectedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TamperDetectionSystem;
