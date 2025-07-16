import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Lock
} from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';

interface ComplianceMetric {
  id: string;
  name: string;
  standard: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  score: number;
  lastAssessed: string;
  nextAssessment: string;
  requirements: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  resource: string;
  result: 'success' | 'failure' | 'warning';
  details: string;
}

const ComplianceDashboard = () => {
  const { user } = useBlockchain();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetric[]>([
    {
      id: '1',
      name: 'Data Protection',
      standard: 'GDPR',
      status: 'compliant',
      score: 98,
      lastAssessed: '2024-01-15',
      nextAssessment: '2024-04-15',
      requirements: { total: 47, completed: 46, inProgress: 1, pending: 0 }
    },
    {
      id: '2',
      name: 'Healthcare Privacy',
      standard: 'HIPAA',
      status: 'compliant',
      score: 95,
      lastAssessed: '2024-01-10',
      nextAssessment: '2024-04-10',
      requirements: { total: 78, completed: 74, inProgress: 3, pending: 1 }
    },
    {
      id: '3',
      name: 'Financial Compliance',
      standard: 'SOX',
      status: 'warning',
      score: 87,
      lastAssessed: '2024-01-12',
      nextAssessment: '2024-04-12',
      requirements: { total: 52, completed: 45, inProgress: 5, pending: 2 }
    },
    {
      id: '4',
      name: 'Security Controls',
      standard: 'ISO 27001',
      status: 'compliant',
      score: 96,
      lastAssessed: '2024-01-08',
      nextAssessment: '2024-04-08',
      requirements: { total: 114, completed: 109, inProgress: 4, pending: 1 }
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-01-16T10:30:00Z',
      action: 'Data Access',
      user: 'john.doe@company.com',
      resource: 'Patient Record #12345',
      result: 'success',
      details: 'Accessed patient medical history for treatment planning'
    },
    {
      id: '2',
      timestamp: '2024-01-16T10:15:00Z',
      action: 'Document Signature',
      user: 'jane.smith@company.com',
      resource: 'Contract #C-2024-001',
      result: 'success',
      details: 'Digital signature applied to employment contract'
    },
    {
      id: '3',
      timestamp: '2024-01-16T09:45:00Z',
      action: 'Failed Login Attempt',
      user: 'unknown@external.com',
      resource: 'Admin Dashboard',
      result: 'failure',
      details: 'Multiple failed login attempts detected from IP: 192.168.1.100'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'non-compliant':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failure':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const overallScore = Math.round(complianceMetrics.reduce((sum, metric) => sum + metric.score, 0) / complianceMetrics.length);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Overall Score</p>
                    <p className="text-2xl font-bold text-green-900">{overallScore}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Active Standards</p>
                    <p className="text-2xl font-bold text-blue-900">{complianceMetrics.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Audit Events</p>
                    <p className="text-2xl font-bold text-purple-900">{auditLogs.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-800">Pending Reviews</p>
                    <p className="text-2xl font-bold text-orange-900">3</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="compliance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compliance">Compliance Standards</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="compliance">
              <div className="space-y-4">
                {complianceMetrics.map((metric) => (
                  <Card key={metric.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{metric.name}</h3>
                            <Badge className={getStatusColor(metric.status)}>
                              {getStatusIcon(metric.status)}
                              <span className="ml-1 capitalize">{metric.status}</span>
                            </Badge>
                            <Badge variant="outline">{metric.standard}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Last assessed: {new Date(metric.lastAssessed).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{metric.score}%</div>
                          <div className="text-sm text-gray-600">Score</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{metric.requirements.completed}/{metric.requirements.total} requirements</span>
                        </div>
                        <Progress value={(metric.requirements.completed / metric.requirements.total) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Completed: {metric.requirements.completed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>In Progress: {metric.requirements.inProgress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Pending: {metric.requirements.pending}</span>
                        </div>
                        <div className="text-gray-600">
                          Next: {new Date(metric.nextAssessment).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <Card key={log.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getResultIcon(log.result)}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{log.action}</h3>
                              <Badge variant="outline" className="text-xs">
                                {log.result}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <div>User: {log.user}</div>
                              <div>Resource: {log.resource}</div>
                              <div>Time: {new Date(log.timestamp).toLocaleString()}</div>
                            </div>
                            <p className="text-sm text-gray-800">{log.details}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Compliance reports are generated automatically and can be downloaded for regulatory submissions.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Monthly Compliance Report</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Generated:</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Period:</span>
                          <span>January 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className="bg-green-100 text-green-800">Ready</Badge>
                        </div>
                        <Button className="w-full" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Audit Trail Export</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Records:</span>
                          <span>1,247 events</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Period:</span>
                          <span>Last 30 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>CSV/JSON</span>
                        </div>
                        <Button className="w-full" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceDashboard;