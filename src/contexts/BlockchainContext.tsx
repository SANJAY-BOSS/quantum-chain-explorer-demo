
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Block, Transaction, BlockchainState } from '../types/blockchain';
import { createGenesisBlock, createNewBlock, calculateHash } from '../utils/blockchain';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BlockchainContextType {
  state: BlockchainState;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<string>;
  mineBlock: () => Promise<void>;
  verifyData: (hash: string) => Transaction | null;
  resetChain: () => Promise<void>;
  toggleCryptoMode: () => Promise<void>;
  isAuthenticated: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  saveDataRecord: (data: { title: string; content: string; recordType: string; metadata?: any }) => Promise<string | null>;
  verifyDataIntegrity: (recordId: string) => Promise<boolean>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

type BlockchainAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'MINE_BLOCK' }
  | { type: 'RESET_CHAIN' }
  | { type: 'TOGGLE_CRYPTO_MODE' }
  | { type: 'SET_MINING'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: BlockchainState }
  | { type: 'SET_AUTH'; payload: { user: any; isAuthenticated: boolean } };

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
        isMining: false,
      };
    
    case 'RESET_CHAIN':
      const genesisBlock = createGenesisBlock();
      return {
        chain: [genesisBlock],
        pendingTransactions: [],
        cryptoMode: 'post-quantum',
        totalBlocks: 1,
        totalTransactions: 0,
        isMining: false,
      };
    
    case 'TOGGLE_CRYPTO_MODE':
      return {
        ...state,
        cryptoMode: state.cryptoMode === 'classical' ? 'post-quantum' : 'classical',
      };
    
    case 'SET_MINING':
      return {
        ...state,
        isMining: action.payload,
      };
    
    case 'LOAD_STATE':
      return action.payload;
    
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
  isMining: false,
};

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(blockchainReducer, initialState);
  const [user, setUser] = React.useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Load blockchain state from Supabase on mount
  useEffect(() => {
    loadBlockchainState();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save blockchain state to Supabase whenever it changes
  useEffect(() => {
    if (state.chain.length > 1) { // Don't save initial genesis state
      saveBlockchainState();
    }
  }, [state]);

  const loadBlockchainState = async () => {
    try {
      const { data, error } = await supabase
        .from('blockchain_state')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const savedState = data[0];
        const loadedState: BlockchainState = {
          chain: (savedState.chain_data as unknown) as Block[],
          pendingTransactions: (savedState.pending_transactions as unknown) as Transaction[] || [],
          cryptoMode: savedState.crypto_mode as 'classical' | 'post-quantum',
          totalBlocks: savedState.total_blocks || 1,
          totalTransactions: savedState.total_transactions || 0,
          isMining: savedState.is_mining || false,
        };
        dispatch({ type: 'LOAD_STATE', payload: loadedState });
      }
    } catch (error) {
      console.error('Failed to load blockchain state:', error);
    }
  };

  const saveBlockchainState = async () => {
    try {
      const { error } = await supabase
        .from('blockchain_state')
        .upsert({
          chain_data: state.chain as any,
          pending_transactions: state.pendingTransactions as any,
          crypto_mode: state.cryptoMode,
          total_blocks: state.totalBlocks,
          total_transactions: state.totalTransactions,
          is_mining: state.isMining,
          last_updated: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save blockchain state:', error);
    }
  };

  // Auto-mine blocks every 30 seconds if there are pending transactions
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.pendingTransactions.length > 0 && !state.isMining) {
        mineBlock();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [state.pendingTransactions.length, state.isMining]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'timestamp'>): Promise<string> => {
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...transactionData,
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    // Log audit trail
    if (user) {
      await logAuditEvent('add_transaction', null, transaction.dataHash, { transaction_id: transaction.id }, true);
    }

    return transaction.id;
  };

  const mineBlock = async () => {
    if (!state.isMining && state.pendingTransactions.length > 0) {
      dispatch({ type: 'SET_MINING', payload: true });
      
      setTimeout(async () => {
        dispatch({ type: 'MINE_BLOCK' });
        
        // Log audit trail
        if (user) {
          await logAuditEvent('mine_block', null, null, { 
            block_index: state.chain.length,
            transactions_count: state.pendingTransactions.length 
          }, true);
        }
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

  const resetChain = async () => {
    dispatch({ type: 'RESET_CHAIN' });
    
    // Clear blockchain state in database
    try {
      await supabase.from('blockchain_state').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (error) {
      console.error('Failed to clear blockchain state:', error);
    }

    // Log audit trail
    if (user) {
      await logAuditEvent('reset_chain', null, null, {}, true);
    }
  };

  const toggleCryptoMode = async () => {
    dispatch({ type: 'TOGGLE_CRYPTO_MODE' });
    
    // Log audit trail
    if (user) {
      await logAuditEvent('toggle_crypto_mode', null, null, { 
        new_mode: state.cryptoMode === 'classical' ? 'post-quantum' : 'classical' 
      }, true);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const saveDataRecord = async (data: { 
    title: string; 
    content: string; 
    recordType: string; 
    metadata?: any 
  }): Promise<string | null> => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save data", variant: "destructive" });
      return null;
    }

    try {
      // Generate hash of the content
      const dataHash = calculateHash(data.content + data.title + Date.now());
      
      // Save to Supabase
      const { data: record, error } = await supabase
        .from('data_records')
        .insert({
          user_id: user.id,
          record_type: data.recordType,
          title: data.title,
          content: data.content,
          metadata: data.metadata || {},
          data_hash: dataHash,
        })
        .select()
        .single();

      if (error) throw error;

      // Add transaction to blockchain
      const transactionId = await addTransaction({
        sender: user.email || 'Anonymous',
        dataHash,
        data: `${data.recordType}: ${data.title}`,
        signature: `user_${user.id}_${Date.now()}`,
        cryptoAlgorithm: state.cryptoMode === 'post-quantum' ? 'CRYSTALS-Dilithium-5' : 'ECDSA-P256',
      });

      // Update record with blockchain hash
      await supabase
        .from('data_records')
        .update({ blockchain_hash: transactionId, blockchain_verified: true })
        .eq('id', record.id);

      // Log audit event
      await logAuditEvent('save_data_record', record.id, dataHash, { 
        transaction_id: transactionId,
        record_type: data.recordType 
      }, true);

      toast({ title: "Success", description: "Data saved and added to blockchain" });
      return record.id;
    } catch (error: any) {
      console.error('Failed to save data record:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return null;
    }
  };

  const verifyDataIntegrity = async (recordId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Get record from database
      const { data: record, error } = await supabase
        .from('data_records')
        .select('*')
        .eq('id', recordId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Verify hash exists in blockchain
      const transaction = verifyData(record.data_hash);
      const isValid = !!transaction;

      // Log audit event
      await logAuditEvent('verify_data_integrity', recordId, record.data_hash, { 
        verification_result: isValid 
      }, isValid);

      return isValid;
    } catch (error: any) {
      console.error('Failed to verify data integrity:', error);
      await logAuditEvent('verify_data_integrity', recordId, null, { 
        error: error.message 
      }, false, error.message);
      return false;
    }
  };

  const logAuditEvent = async (
    actionType: string,
    recordId: string | null,
    hashVerified: string | null,
    blockchainResponse: any,
    success: boolean,
    errorMessage?: string
  ) => {
    try {
      await supabase.from('blockchain_audit').insert({
        user_id: user?.id || null,
        action_type: actionType,
        record_id: recordId,
        hash_verified: hashVerified,
        blockchain_response: blockchainResponse,
        success,
        error_message: errorMessage || null,
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  };

  return (
    <BlockchainContext.Provider value={{
      state,
      addTransaction,
      mineBlock,
      verifyData,
      resetChain,
      toggleCryptoMode,
      isAuthenticated,
      user,
      signIn,
      signUp,
      signOut,
      saveDataRecord,
      verifyDataIntegrity,
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
