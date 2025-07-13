
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
