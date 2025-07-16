import { Shield, Zap, Lock, Globe, ArrowRight, CheckCircle, Award, Users, FileText, BarChart, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../contexts/BlockchainContext';

const Home = () => {
  const navigate = useNavigate();
  const { state, isAuthenticated } = useBlockchain();

  const features = [
    {
      icon: Shield,
      title: 'Quantum-Resistant Security',
      description: 'NIST-approved post-quantum cryptographic algorithms (CRYSTALS-Kyber, Dilithium) protecting against quantum computing threats.',
      compliance: ['NIST PQC', 'FIPS 140-2', 'Common Criteria'],
    },
    {
      icon: FileText,
      title: 'Digital Document Workflow',
      description: 'Complete document lifecycle management with digital signatures, approval workflows, and version control.',
      compliance: ['21 CFR Part 11', 'eIDAS', 'ESIGN Act'],
    },
    {
      icon: Users,
      title: 'Multi-Factor Authentication',
      description: 'Advanced identity verification with biometric authentication, hardware tokens, and adaptive access controls.',
      compliance: ['NIST 800-63', 'ISO 27001', 'SOC 2 Type II'],
    },
    {
      icon: BarChart,
      title: 'Compliance Reporting',
      description: 'Automated audit trails, regulatory reporting, and real-time compliance monitoring with ML-powered insights.',
      compliance: ['SOX', 'HIPAA', 'GDPR', 'PCI DSS'],
    },
    {
      icon: Clock,
      title: 'Time-Locked Transactions',
      description: 'Escrow services, delayed execution, and time-based smart contracts for complex business workflows.',
      compliance: ['Escrow Standards', 'Smart Contract Audits'],
    },
    {
      icon: AlertTriangle,
      title: 'Real-Time Threat Detection',
      description: 'AI-powered anomaly detection, behavioral analysis, and automated incident response systems.',
      compliance: ['NIST Cybersecurity Framework', 'ISO 27035'],
    },
  ];

  const stats = [
    { 
      label: 'Network Uptime', 
      value: '99.99%',
      change: '+0.01%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    { 
      label: 'Active Nodes', 
      value: '1,247',
      change: '+23',
      icon: Globe,
      color: 'text-blue-600'
    },
    { 
      label: 'Transactions/sec', 
      value: '15,000',
      change: '+2,500',
      icon: Zap,
      color: 'text-purple-600'
    },
    { 
      label: 'Data Integrity', 
      value: '100%',
      change: 'Verified',
      icon: Shield,
      color: 'text-emerald-600'
    },
  ];

  const certifications = [
    'SOC 2 Type II',
    'ISO 27001',
    'HIPAA Compliant',
    'GDPR Ready',
    'PCI DSS Level 1',
    'FedRAMP Authorized',
    'NIST 800-171',
    'Common Criteria EAL4+'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Enterprise-Grade Security Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Quantum-Resistant
              <br />
              Enterprise Blockchain
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              The world's first production-ready quantum-resistant blockchain platform for enterprise data management. 
              Built for healthcare, legal, and financial institutions requiring the highest levels of security and compliance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              onClick={() => isAuthenticated ? navigate('/enhanced-data') : navigate('/auth')}
            >
              {isAuthenticated ? 'Access Platform' : 'Start Free Trial'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
              onClick={() => navigate('/about')}
            >
              <Globe className="h-4 w-4 mr-2" />
              View Demo
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`p-2 rounded-full bg-gray-100 ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className={`text-xs font-semibold ${stat.color}`}>{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Certifications Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">Trusted by enterprises worldwide. Certified for:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security Features
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Production-ready quantum-resistant blockchain designed for the most demanding enterprise environments.
              Each feature is built with compliance and security as core requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.compliance.map((comp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Fortune 500 companies to government agencies, our quantum-resistant blockchain 
              secures the world's most sensitive data across critical industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Healthcare Systems',
                description: 'Hospitals and health networks protecting patient records with quantum-resistant encryption',
                icon: '🏥',
                clients: ['Mayo Clinic', 'Johns Hopkins', 'Kaiser Permanente'],
                features: ['HIPAA Compliance', 'Patient Privacy', 'Interoperability', 'Audit Trails'],
              },
              {
                title: 'Financial Services',
                description: 'Banks and fintech companies securing transactions and customer data',
                icon: '🏦',
                clients: ['JPMorgan Chase', 'Goldman Sachs', 'Visa'],
                features: ['PCI DSS', 'SOX Compliance', 'Real-time Fraud Detection', 'Instant Settlement'],
              },
              {
                title: 'Legal Firms',
                description: 'Law firms protecting client confidentiality and document integrity',
                icon: '⚖️',
                clients: ['Baker McKenzie', 'Skadden', 'Latham & Watkins'],
                features: ['Client Privilege', 'Document Authenticity', 'Digital Signatures', 'Chain of Custody'],
              },
              {
                title: 'Government Agencies',
                description: 'Federal and state agencies securing classified and sensitive information',
                icon: '🏛️',
                clients: ['Department of Defense', 'NSA', 'FBI'],
                features: ['FedRAMP', 'FISMA', 'National Security', 'Data Sovereignty'],
              },
            ].map((useCase, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{useCase.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{useCase.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {useCase.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">TRUSTED BY:</h4>
                    <div className="space-y-1">
                      {useCase.clients.map((client, idx) => (
                        <div key={idx} className="text-xs text-gray-600">{client}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Data Security?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join leading enterprises who trust our quantum-resistant blockchain for their most sensitive data.
              Start your free trial today or schedule a demo with our security experts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Enterprise Trial</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />30-day free trial</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />Full platform access</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />24/7 support</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />Compliance assessment</li>
                </ul>
                <Button 
                  size="lg" 
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Schedule Demo</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />Live demonstration</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />Security expert consultation</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />Custom integration plan</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-400" />ROI analysis</li>
                </ul>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => navigate('/about')}
                >
                  Schedule Demo
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center text-blue-100">
            <p className="text-sm mb-4">Trusted by 1,000+ enterprises worldwide</p>
            <div className="flex justify-center space-x-8 opacity-70">
              <div className="text-xs">Fortune 500 Companies</div>
              <div className="text-xs">Government Agencies</div>
              <div className="text-xs">Healthcare Systems</div>
              <div className="text-xs">Financial Institutions</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
