-- Create a function to help add admin users
-- First, let's see current users and add some sample admin users
-- You'll need to replace these UUIDs with actual user IDs from your auth.users table

-- Function to safely add admin role to a user
CREATE OR REPLACE FUNCTION public.add_admin_role(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert admin role (will ignore if already exists due to unique constraint)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin role added to user %', user_email;
END;
$$;

-- Example: Add admin role to your email (replace with your actual email)
-- SELECT public.add_admin_role('your-email@example.com');

-- Create view for user management that combines auth and profile data
CREATE OR REPLACE VIEW public.user_management_view AS
SELECT 
  au.id,
  au.email,
  au.created_at as signed_up_at,
  au.last_sign_in_at,
  au.email_confirmed_at,
  p.display_name,
  p.first_name,
  p.last_name,
  COALESCE(ur.role::text, 'user') as role,
  CASE 
    WHEN au.last_sign_in_at > NOW() - INTERVAL '5 minutes' THEN 'online'
    WHEN au.last_sign_in_at > NOW() - INTERVAL '1 hour' THEN 'recently_active'
    ELSE 'offline'
  END as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
LEFT JOIN public.user_roles ur ON au.id = ur.user_id;

-- Allow admins to view this user management data
CREATE POLICY "Admins can view user management" ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Grant usage on the view to authenticated users (but RLS will still apply)
GRANT SELECT ON public.user_management_view TO authenticated;