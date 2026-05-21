-- Revoke EXECUTE on SECURITY DEFINER role-check functions from public/anon/authenticated.
-- RLS policies still work because they execute as the policy owner, not the caller.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'app_private' AND p.proname = 'has_role'
  ) THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated';
  END IF;
END $$;