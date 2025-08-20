-- Fix security issue: Restrict transaction access to participants only
-- Drop the overly permissive "Anyone can read transactions" policy
DROP POLICY IF EXISTS "Anyone can read transactions" ON public.transactions;

-- Create new restrictive policies for transaction access
-- Allow users to see transactions where they are sender or receiver
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (
  auth.uid()::text = sender OR 
  auth.uid()::text = receiver
);

-- Allow admins to view all transactions for audit purposes
CREATE POLICY "Admins can view all transactions" 
ON public.transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Allow auditors to view all transactions for compliance
CREATE POLICY "Auditors can view all transactions" 
ON public.transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'auditor'::app_role
  )
);

-- Keep the system management policy for blockchain operations
-- (This policy already exists and is needed for the blockchain system to function)