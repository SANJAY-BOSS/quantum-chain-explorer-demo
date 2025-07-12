
export interface Transaction {
  id: string;
  timestamp: number;
  sender: string;
  dataHash: string;
  data: string;
  signature: string;
  cryptoAlgorithm: string;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
  validator: string;
  consensusAlgorithm: string;
  cryptoMode: 'classical' | 'post-quantum';
}

export interface BlockchainState {
  chain: Block[];
  pendingTransactions: Transaction[];
  cryptoMode: 'classical' | 'post-quantum';
  totalBlocks: number;
  totalTransactions: number;
  isMining: boolean;
}
