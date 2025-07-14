
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Lock, 
  Key, 
  Database, 
  Network,
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

const EducationalSection = () => {
  const concepts = [
    {
      title: "Post-Quantum Cryptography",
      icon: Shield,
      description: "Cryptographic algorithms designed to be secure against both classical and quantum computer attacks.",
      details: [
        "Traditional encryption (RSA, ECC) vulnerable to quantum computers",
        "PQC uses mathematical problems hard for quantum computers",
        "NIST standardized algorithms like CRYSTALS-Kyber and Dilithium",
        "Essential for long-term data security"
      ],
      algorithms: ["CRYSTALS-Kyber-1024", "CRYSTALS-Dilithium-5", "SHAKE256"]
    },
    {
      title: "Blockchain Hash Verification",
      icon: Database,
      description: "How cryptographic hashes ensure data integrity in distributed systems.",
      details: [
        "Each data record generates a unique cryptographic hash",
        "Hashes stored immutably on blockchain",
        "Any data change produces completely different hash",
        "Verification proves data hasn't been tampered with"
      ],
      algorithms: ["SHA3-512", "BLAKE2b", "Keccak-256"]
    },
    {
      title: "Quantum Threat Timeline",
      icon: AlertTriangle,
      description: "Understanding when quantum computers will threaten current cryptography.",
      details: [
        "Current quantum computers: 50-100+ qubits",
        "Breaking RSA-2048 needs ~4000+ logical qubits",
        "Timeline estimates: 10-20 years for cryptographically relevant",
        "Start migrating to PQC now for future-proofing"
      ],
      algorithms: ["Shor's Algorithm", "Grover's Algorithm"]
    },
    {
      title: "Digital Signatures",
      icon: Key,
      description: "How digital signatures provide authentication and non-repudiation.",
      details: [
        "Proves data came from specific sender",
        "Prevents repudiation (can't deny sending)",
        "Detects any tampering with signed data",
        "PQC signatures resist quantum attacks"
      ],
      algorithms: ["CRYSTALS-Dilithium", "FALCON", "SPHINCS+"]
    }
  ];

  const comparisonData = [
    {
      aspect: "Key Exchange",
      classical: "ECDH (256-bit)",
      postQuantum: "CRYSTALS-Kyber-1024",
      quantumThreat: "High"
    },
    {
      aspect: "Digital Signatures",
      classical: "ECDSA (256-bit)",
      postQuantum: "CRYSTALS-Dilithium-5",
      quantumThreat: "High"
    },
    {
      aspect: "Hash Functions",
      classical: "SHA-256",
      postQuantum: "SHAKE256",
      quantumThreat: "Medium"
    },
    {
      aspect: "Symmetric Encryption",
      classical: "AES-256",
      postQuantum: "AES-256 (doubled key)",
      quantumThreat: "Low"
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Quantum-Resistant Cryptography
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Understanding the future of cryptography and why quantum-resistant algorithms are essential for long-term data security.
          </p>
        </div>

        {/* Core Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {concepts.map((concept, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <concept.icon className="h-6 w-6 text-blue-600" />
                  {concept.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{concept.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Key Points:</h4>
                  <ul className="space-y-1">
                    {concept.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {concept.algorithms.map((algo, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {algo}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Classical vs Post-Quantum Algorithms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Cryptographic Function</th>
                    <th className="text-left p-3 font-semibold">Classical Algorithm</th>
                    <th className="text-left p-3 font-semibold">Post-Quantum Algorithm</th>
                    <th className="text-left p-3 font-semibold">Quantum Threat Level</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{row.aspect}</td>
                      <td className="p-3 font-mono text-sm">{row.classical}</td>
                      <td className="p-3 font-mono text-sm">{row.postQuantum}</td>
                      <td className="p-3">
                        <Badge 
                          className={
                            row.quantumThreat === 'High' ? 'bg-red-100 text-red-800' :
                            row.quantumThreat === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        >
                          {row.quantumThreat}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Implementation in This App */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              How This Application Uses PQC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Data Integrity Protection</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>All data records are hashed using SHAKE256</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Hashes stored immutably on simulated blockchain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>CRYSTALS-Dilithium-5 signatures for authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-time verification against blockchain records</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Future-Proof Security</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Algorithms resistant to quantum computer attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Seamless switching between classical and PQC modes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Audit trails for all cryptographic operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Long-term data protection guarantees</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantum Computer Timeline */}
        <Card className="mb-12 bg-gradient-to-r from-red-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Quantum Computing Timeline & Threat Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-lg">Current State (2024)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm">IBM's Largest Quantum Computer:</span>
                    <Badge className="bg-blue-100 text-blue-800">1,121 qubits</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm">Google's Quantum Supremacy:</span>
                    <Badge className="bg-green-100 text-green-800">70 qubits</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-sm">Cryptographically Relevant:</span>
                    <Badge className="bg-red-100 text-red-800">4,000+ qubits needed</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-lg">Expert Predictions</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">RSA-2048 Breaking:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">2030-2040</Badge>
                    </div>
                    <p className="text-xs text-gray-600">Conservative estimate by cryptographers</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">ECC-256 Breaking:</span>
                      <Badge className="bg-orange-100 text-orange-800">2025-2035</Badge>
                    </div>
                    <p className="text-xs text-gray-600">Elliptic curve cryptography more vulnerable</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Migration Deadline:</span>
                      <Badge className="bg-red-100 text-red-800">2030</Badge>
                    </div>
                    <p className="text-xs text-gray-600">NIST recommends completing migration by 2030</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practical Implementation Guide */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Implementing PQC in Your Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold">Assessment Phase</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Inventory all cryptographic systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Identify quantum-vulnerable components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Prioritize critical data systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Calculate migration timeline</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold">Implementation Phase</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Deploy hybrid classical+PQC systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Test PQC algorithms in staging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Train technical staff on new algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Update security policies and procedures</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold">Validation Phase</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Conduct security audits and penetration testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Monitor performance impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Verify compliance with standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Plan for ongoing algorithm updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-8">
            <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Securing Your Data Today
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't wait for quantum computers to become a threat. Begin protecting your sensitive data 
              with quantum-resistant cryptography now. Every record you secure today will remain protected 
              in the quantum future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
                NIST-Approved Algorithms
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                Future-Proof Security
              </Badge>
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                Blockchain Verified
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationalSection;
