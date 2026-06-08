## Goal
When creating a new admin account via `/auth`, skip the email confirmation step so the new user is signed in immediately after submitting the form.

## Change
Enable **auto-confirm email** on the backend auth settings. With this on, `supabase.auth.signUp()` returns an active session right away — no confirmation email is sent, and the user is signed in with the password they just chose.

No code changes needed; the existing `signUp` flow in `src/hooks/useAuth.tsx` and `src/pages/Auth.tsx` already handles the returned session via `onAuthStateChange`.

## Note
This applies to all signups on the project (it's a project-wide auth setting, not admin-only). Since signups here are only used to create admin accounts (then granted the role manually), that's fine — but worth confirming you're okay with that.
