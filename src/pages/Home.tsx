import { Shield, Zap, Lock, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../contexts/BlockchainContext';

const Home = () => {
  const navigate = useNavigate();
  const { state } = useBlockchain();

  const features = [
    {
      icon: Shield,
      title: 'Quantum-Resistant Security',
      description: 'Built with post-quantum cryptographic algorithms like CRYSTALS-Kyber and Dilithium to withstand quantum attacks.',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Optimized consensus algorithms ensure fast transaction processing while maintaining security.',
    },
    {
      icon: Lock,
      title: 'Data Integrity',
      description: 'Immutable ledger with cryptographic hashing ensures your data remains tamper-proof.',
    },
    {
      icon: Globe,
      title: 'Enterprise Ready',
      description: 'Designed for medical, financial, and government sectors requiring the highest security standards.',
    },
  ];

  const stats = [
    { label: 'Total Blocks', value: state.totalBlocks },
    { label: 'Total Transactions', value: state.totalTransactions },
    { label: 'Crypto Mode', value: state.cryptoMode === 'post-quantum' ? 'Post-Quantum' : 'Classical' },
    { label: 'Status', value: state.isMining ? 'Mining' : 'Active' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Quantum-Resistant
              <br />
              Blockchain System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of secure data transactions with our post-quantum cryptographic blockchain.
              Built for enterprises that demand unbreakable security.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              onClick={() => navigate('/explorer')}
            >
              Explore Blockchain
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Quantum-Resistant Blockchain?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our blockchain system is designed to protect against both classical and quantum threats,
              ensuring your data remains secure in the quantum computing era.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise Use Cases</h2>
            <p className="text-xl text-gray-600">
              Trusted by organizations requiring the highest levels of security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Healthcare Records',
                description: 'Secure patient data with quantum-resistant encryption ensuring HIPAA compliance and future-proof security.',
                features: ['Patient Privacy', 'Audit Trails', 'Interoperability'],
              },
              {
                title: 'Financial Transactions',
                description: 'Process high-value transactions with post-quantum security standards for banks and financial institutions.',
                features: ['Regulatory Compliance', 'Instant Settlement', 'Fraud Prevention'],
              },
              {
                title: 'Government Records',
                description: 'Protect classified and sensitive government data with military-grade quantum-resistant cryptography.',
                features: ['National Security', 'Data Sovereignty', 'Long-term Archival'],
              },
            ].map((useCase, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{useCase.title}</h3>
                  <p className="text-gray-600 mb-6">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Secure Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start exploring our quantum-resistant blockchain system today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
              onClick={() => navigate('/submit')}
            >
              Submit Your First Transaction
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
              onClick={() => navigate('/admin')}
            >
              View Admin Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
