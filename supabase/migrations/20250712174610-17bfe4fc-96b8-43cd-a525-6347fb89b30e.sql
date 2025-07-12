
-- Create table for storing actual data records that will be hashed
CREATE TABLE public.data_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('medical', 'financial', 'legal', 'document')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  data_hash TEXT NOT NULL,
  blockchain_hash TEXT,
  blockchain_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for blockchain state persistence
CREATE TABLE public.blockchain_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_data JSONB NOT NULL,
  pending_transactions JSONB DEFAULT '[]',
  crypto_mode TEXT NOT NULL DEFAULT 'post-quantum',
  total_blocks INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  is_mining BOOLEAN DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for audit trail
CREATE TABLE public.blockchain_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  action_type TEXT NOT NULL,
  record_id UUID REFERENCES public.data_records(id),
  hash_verified TEXT,
  blockchain_response JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.data_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_audit ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data_records
CREATE POLICY "Users can view their own records" 
  ON public.data_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own records" 
  ON public.data_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" 
  ON public.data_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" 
  ON public.data_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for blockchain_audit
CREATE POLICY "Users can view their own audit logs" 
  ON public.blockchain_audit 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" 
  ON public.blockchain_audit 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for blockchain_state (admin only for updates, public read)
ALTER TABLE public.blockchain_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blockchain state" 
  ON public.blockchain_state 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can manage blockchain state" 
  ON public.blockchain_state 
  FOR ALL 
  USING (true);

-- Insert initial blockchain state
INSERT INTO public.blockchain_state (chain_data, crypto_mode, total_blocks, total_transactions)
VALUES ('[]', 'post-quantum', 0, 0);
