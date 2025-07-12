
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Block, Transaction, BlockchainState } from '../types/blockchain';
import { createGenesisBlock, createNewBlock, calculateHash } from '../utils/blockchain';

interface BlockchainContextType {
  state: BlockchainState;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => string;
  mineBlock: () => void;
  verifyData: (hash: string) => Transaction | null;
  resetChain: () => void;
  toggleCryptoMode: () => void;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

type BlockchainAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'MINE_BLOCK' }
  | { type: 'RESET_CHAIN' }
  | { type: 'TOGGLE_CRYPTO_MODE' }
  | { type: 'SET_MINING'; payload: boolean };

const blockchainReducer = (state: BlockchainState, action: BlockchainAction): BlockchainState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        pendingTransactions: [...state.pendingTransactions, action.payload],
        totalTransactions: state.totalTransactions + 1,
      };
    
    case 'MINE_BLOCK':
      if (state.pendingTransactions.length === 0) return state;
      
      const newBlock = createNewBlock(
        state.chain[state.chain.length - 1],
        state.pendingTransactions,
        state.cryptoMode
      );
      
      return {
        ...state,
        chain: [...state.chain, newBlock],
        pendingTransactions: [],
        totalBlocks: state.totalBlocks + 1,
        ismining: false,
      };
    
    case 'RESET_CHAIN':
      const genesisBlock = createGenesisBlock();
      return {
        chain: [genesisBlock],
        pendingTransactions: [],
        cryptoMode: 'post-quantum',
        totalBlocks: 1,
        totalTransactions: 0,
        ismining: false,
      };
    
    case 'TOGGLE_CRYPTO_MODE':
      return {
        ...state,
        cryptoMode: state.cryptoMode === 'classical' ? 'post-quantum' : 'classical',
      };
    
    case 'SET_MINING':
      return {
        ...state,
        ismining: action.payload,
      };
    
    default:
      return state;
  }
};

const initialState: BlockchainState = {
  chain: [createGenesisBlock()],
  pendingTransactions: [],
  cryptoMode: 'post-quantum',
  totalBlocks: 1,
  totalTransactions: 0,
  ismining: false,
};

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(blockchainReducer, initialState);

  // Auto-mine blocks every 30 seconds if there are pending transactions
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.pendingTransactions.length > 0 && !state.ismining) {
        dispatch({ type: 'SET_MINING', payload: true });
        setTimeout(() => {
          dispatch({ type: 'MINE_BLOCK' });
        }, 3000); // Simulate mining time
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [state.pendingTransactions.length, state.ismining]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>): string => {
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...transactionData,
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    return transaction.id;
  };

  const mineBlock = () => {
    if (!state.ismining && state.pendingTransactions.length > 0) {
      dispatch({ type: 'SET_MINING', payload: true });
      setTimeout(() => {
        dispatch({ type: 'MINE_BLOCK' });
      }, 2000);
    }
  };

  const verifyData = (hash: string): Transaction | null => {
    for (const block of state.chain) {
      const transaction = block.transactions.find(tx => tx.dataHash === hash);
      if (transaction) return transaction;
    }
    return null;
  };

  const resetChain = () => {
    dispatch({ type: 'RESET_CHAIN' });
  };

  const toggleCryptoMode = () => {
    dispatch({ type: 'TOGGLE_CRYPTO_MODE' });
  };

  return (
    <BlockchainContext.Provider value={{
      state,
      addTransaction,
      mineBlock,
      verifyData,
      resetChain,
      toggleCryptoMode,
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
