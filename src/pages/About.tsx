
import { Shield, Cpu, Lock, Zap, Users, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const cryptoAlgorithms = [
    {
      name: 'CRYSTALS-Kyber',
      type: 'Key Exchange',
      description: 'Post-quantum key encapsulation mechanism based on lattice cryptography, providing secure key exchange resistant to quantum attacks.',
      keySize: '1024-bit',
      security: 'NIST Level 3',
    },
    {
      name: 'CRYSTALS-Dilithium',
      type: 'Digital Signatures',
      description: 'Quantum-resistant digital signature scheme providing authentication and non-repudiation with strong security guarantees.',
      keySize: '2592-bit',
      security: 'NIST Level 3',
    },
    {
      name: 'SHAKE256',
      type: 'Hash Function',
      description: 'Extendable-output cryptographic hash function providing quantum-resistant hashing with variable output length.',
      keySize: 'Variable',
      security: 'Quantum-resistant',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Post-Quantum Cryptography',
      description: 'Built with NIST-standardized quantum-resistant algorithms that protect against both classical and quantum computer attacks.',
    },
    {
      icon: Cpu,
      title: 'Advanced Consensus',
      description: 'Implements Byzantine Fault Tolerant consensus with post-quantum signatures for secure and efficient block validation.',
    },
    {
      icon: Lock,
      title: 'Data Integrity',
      description: 'Merkle tree structures with quantum-resistant hashing ensure tamper-proof data storage and verification.',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Optimized algorithms provide fast transaction processing while maintaining the highest security standards.',
    },
    {
      icon: Users,
      title: 'Enterprise Grade',
      description: 'Designed for mission-critical applications in healthcare, finance, and government sectors.',
    },
    {
      icon: Globe,
      title: 'Future-Proof',
      description: 'Investment in quantum-resistant technology ensures long-term security as quantum computing advances.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About QuantumChain
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our quantum-resistant blockchain system represents the next evolution in secure data management,
            combining cutting-edge post-quantum cryptography with proven blockchain technology to create
            an unbreakable foundation for tomorrow's digital infrastructure.
          </p>
        </div>

        {/* Quantum Threat Section */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-red-800 mb-4">
                The Quantum Threat
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-red-700 mb-3">Current Risk</h3>
                  <p className="text-gray-700 mb-4">
                    Quantum computers pose an existential threat to current cryptographic systems. Shor's algorithm
                    can break RSA, ECC, and other public-key cryptosystems that secure today's internet.
                  </p>
                  <p className="text-gray-700">
                    As quantum computers become more powerful, traditional blockchain systems will become vulnerable
                    to attacks that could compromise transaction integrity and user privacy.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-700 mb-3">Our Solution</h3>
                  <p className="text-gray-700 mb-4">
                    QuantumChain implements post-quantum cryptographic algorithms that are mathematically proven
                    to resist attacks from both classical and quantum computers.
                  </p>
                  <p className="text-gray-700">
                    By transitioning to quantum-resistant systems now, organizations can protect their data
                    for decades to come, ensuring business continuity in the quantum era.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Key Features & Benefits
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cryptographic Algorithms */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Post-Quantum Cryptographic Algorithms
          </h2>
          <div className="space-y-6">
            {cryptoAlgorithms.map((algorithm, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">{algorithm.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{algorithm.type}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-700">{algorithm.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Key Size:</span>
                        <span className="ml-2 text-sm text-gray-900">{algorithm.keySize}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Security Level:</span>
                        <span className="ml-2 text-sm text-green-600 font-medium">{algorithm.security}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Technical Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Consensus Mechanism
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Byzantine Fault Tolerance (BFT)</h4>
                    <p className="text-gray-600 text-sm">
                      Advanced consensus algorithm that maintains network integrity even when up to 1/3 of nodes
                      are compromised or behave maliciously.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Post-Quantum Signatures</h4>
                    <p className="text-gray-600 text-sm">
                      All consensus messages are signed using CRYSTALS-Dilithium, ensuring quantum-resistant
                      validator authentication.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dynamic Validator Selection</h4>
                    <p className="text-gray-600 text-sm">
                      Stake-based validator rotation with quantum-resistant randomness ensures decentralization
                      and prevents single points of failure.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Data Security Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quantum-Resistant Hashing</h4>
                    <p className="text-gray-600 text-sm">
                      SHAKE256 provides variable-length hashing that remains secure against quantum attacks
                      while maintaining computational efficiency.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Merkle Tree Integrity</h4>
                    <p className="text-gray-600 text-sm">
                      Binary tree structures with post-quantum hashing enable efficient verification of
                      large datasets with logarithmic complexity.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Forward Secrecy</h4>
                    <p className="text-gray-600 text-sm">
                      Key rotation and perfect forward secrecy ensure that compromise of current keys
                      cannot decrypt historical data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Security Standards */}
        <section>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-800 text-center mb-4">
                Compliance & Standards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">NIST Standards</h3>
                  <p className="text-gray-700">
                    All cryptographic algorithms are NIST-approved and follow the latest post-quantum
                    cryptography standards.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Enterprise Ready</h3>
                  <p className="text-gray-700">
                    Designed for FIPS 140-2 compliance and meets requirements for classified data handling
                    in government and financial sectors.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">Audit Trail</h3>
                  <p className="text-gray-700">
                    Complete immutable audit trails with cryptographic proofs for regulatory compliance
                    and forensic analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
