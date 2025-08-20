-- Tighten transactions RLS by removing permissive ALL policy
DROP POLICY IF EXISTS "System can manage transactions" ON public.transactions;

-- Address linter: set stable search_path on security definer functions
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;
ALTER FUNCTION public.get_user_role(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user_role() SET search_path = public;