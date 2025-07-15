
import { Block, Transaction } from '../types/blockchain';
import { secureHash, generateNonce, validateTimestamp, generateSecureSignature } from './cryptoSecurity';
import { sanitizeBlockchainData } from './inputSanitization';

// Simulated post-quantum cryptographic algorithms
const PQ_ALGORITHMS = {
  keyExchange: 'CRYSTALS-Kyber-1024',
  digitalSignature: 'CRYSTALS-Dilithium-5',
  hash: 'SHAKE256',
};

const CLASSICAL_ALGORITHMS = {
  keyExchange: 'ECDH-P256',
  digitalSignature: 'ECDSA-P256',
  hash: 'SHA3-512',
};

// Enhanced secure hash function using Web Crypto API
export const calculateHash = async (data: string): Promise<string> => {
  const sanitizedData = typeof data === 'string' ? data : JSON.stringify(sanitizeBlockchainData(data));
  return await secureHash(sanitizedData);
};

// Enhanced hash for block data
export const calculateBlockHash = async (block: Omit<Block, 'hash'>): Promise<string> => {
  const blockString = JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    transactions: block.transactions,
    previousHash: block.previousHash,
    nonce: block.nonce,
    merkleRoot: block.merkleRoot,
  });
  return await calculateHash(blockString);
};

// Calculate Merkle root for transactions
export const calculateMerkleRoot = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) return '0';
  
  const hashes = await Promise.all(transactions.map(async tx => 
    await calculateHash(JSON.stringify(sanitizeBlockchainData(tx)))
  ));
  
  while (hashes.length > 1) {
    const newHashes: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = i + 1 < hashes.length ? hashes[i + 1] : left;
      newHashes.push(await calculateHash(left + right));
    }
    hashes.splice(0, hashes.length, ...newHashes);
  }
  
  return hashes[0];
};

// Simulate post-quantum digital signature
export const generatePQSignature = async (data: string, cryptoMode: 'classical' | 'post-quantum'): Promise<string> => {
  const algorithms = cryptoMode === 'post-quantum' ? PQ_ALGORITHMS : CLASSICAL_ALGORITHMS;
  const signature = await generateSecureSignature(data, 'blockchain-private-key');
  return `${algorithms.digitalSignature}:${signature}`;
};

// Create genesis block
export const createGenesisBlock = async (): Promise<Block> => {
  const genesisTransaction: Transaction = {
    id: 'genesis_tx',
    timestamp: Date.now(),
    sender: 'System',
    dataHash: await calculateHash('Genesis Block'),
    data: 'Genesis Block - Quantum-Resistant Blockchain Initialized',
    signature: await generatePQSignature('genesis', 'post-quantum'),
    cryptoAlgorithm: PQ_ALGORITHMS.digitalSignature,
  };

  const block: Omit<Block, 'hash'> = {
    index: 0,
    timestamp: Date.now(),
    transactions: [genesisTransaction],
    previousHash: '0',
    nonce: 0,
    merkleRoot: await calculateMerkleRoot([genesisTransaction]),
    validator: 'Genesis Validator',
    consensusAlgorithm: 'Proof of Stake (PQC)',
    cryptoMode: 'post-quantum',
  };

  return {
    ...block,
    hash: await calculateBlockHash(block),
  };
};

// Create new block with proof-of-work simulation
export const createNewBlock = async (
  previousBlock: Block,
  transactions: Transaction[],
  cryptoMode: 'classical' | 'post-quantum'
): Promise<Block> => {
  let nonce = 0;
  const algorithms = cryptoMode === 'post-quantum' ? PQ_ALGORITHMS : CLASSICAL_ALGORITHMS;
  
  const block: Omit<Block, 'hash'> = {
    index: previousBlock.index + 1,
    timestamp: Date.now(),
    transactions,
    previousHash: previousBlock.hash,
    nonce,
    merkleRoot: await calculateMerkleRoot(transactions),
    validator: `PQ-Validator-${Math.floor(Math.random() * 1000)}`,
    consensusAlgorithm: cryptoMode === 'post-quantum' ? 'BFT-PQC' : 'Proof of Work',
    cryptoMode,
  };

  // Simulate mining with difficulty (hash must start with '00')
  let hash = await calculateBlockHash({ ...block, nonce });
  while (!hash.startsWith('00')) {
    nonce++;
    hash = await calculateBlockHash({ ...block, nonce });
  }

  return {
    ...block,
    nonce,
    hash,
  };
};

// Verify blockchain integrity
export const verifyBlockchain = async (blockchain: Block[]): Promise<boolean> => {
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    // Verify current block hash
    const recalculatedHash = await calculateBlockHash({
      index: currentBlock.index,
      timestamp: currentBlock.timestamp,
      transactions: currentBlock.transactions,
      previousHash: currentBlock.previousHash,
      nonce: currentBlock.nonce,
      merkleRoot: currentBlock.merkleRoot,
      validator: currentBlock.validator,
      consensusAlgorithm: currentBlock.consensusAlgorithm,
      cryptoMode: currentBlock.cryptoMode,
    });

    if (currentBlock.hash !== recalculatedHash) {
      return false;
    }

    // Verify link to previous block
    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }
  }
  return true;
};

// Generate secure data hash
export const generateDataHash = async (data: string, cryptoMode: 'classical' | 'post-quantum'): Promise<string> => {
  const algorithms = cryptoMode === 'post-quantum' ? PQ_ALGORITHMS : CLASSICAL_ALGORITHMS;
  const hash = await calculateHash(data + Date.now());
  return `${algorithms.hash}:${hash}`;
};
