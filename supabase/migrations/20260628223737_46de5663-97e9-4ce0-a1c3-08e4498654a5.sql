DO $$
DECLARE
  admin_emails text;
BEGIN
  SELECT string_agg(u.email, ', ') INTO admin_emails
  FROM auth.users u
  JOIN public.user_roles r ON r.user_id = u.id
  WHERE r.role = 'admin';

  RAISE NOTICE 'Resetting passwords for admins: %', admin_emails;

  UPDATE auth.users
  SET encrypted_password = crypt('Vikusha2026!', gen_salt('bf')),
      updated_at = now()
  WHERE id IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  );
END $$;