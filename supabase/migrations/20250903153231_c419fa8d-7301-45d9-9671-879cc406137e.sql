-- Drop the problematic view that exposed auth.users
DROP VIEW IF EXISTS public.user_management_view;

-- Create a secure function instead that only admins can use
CREATE OR REPLACE FUNCTION public.get_user_management_data()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  signed_up_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    p.user_id,
    p.user_id::TEXT as email, -- We'll get email from profiles or other means
    p.display_name,
    p.first_name,
    p.last_name,
    COALESCE(ur.role::TEXT, 'user') as role,
    p.created_at as signed_up_at,
    p.updated_at as last_sign_in_at, -- We'll track this differently
    'unknown'::TEXT as status -- We'll implement status tracking separately
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id;
END;
$$;

-- Add email field to profiles for admin visibility (optional, safer approach)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create trigger to sync email from auth.users to profiles
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update email in profiles when user signs in
  UPDATE public.profiles 
  SET email = NEW.email,
      updated_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Note: We can't create triggers on auth.users directly, so we'll handle email sync differently
-- Instead, let's create an edge function that admins can call to get user data

-- Clean up the add_admin_role function to be more secure
CREATE OR REPLACE FUNCTION public.add_admin_role(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  profile_exists BOOLEAN;
BEGIN
  -- Only allow existing admins to add other admins
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required to add other admins';
  END IF;
  
  -- Find user by email in profiles table (safer than auth.users)
  SELECT user_id INTO target_user_id
  FROM public.profiles 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User with email ' || user_email || ' not found in profiles';
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'Admin role added to user ' || user_email;
END;
$$;