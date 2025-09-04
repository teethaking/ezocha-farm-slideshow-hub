-- Drop the problematic view that exposed auth.users
DROP VIEW IF EXISTS public.user_management_view;

-- Drop and recreate the add_admin_role function with proper return type
DROP FUNCTION IF EXISTS public.add_admin_role(TEXT);

-- Create a secure function that only admins can use to get user data
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
    COALESCE(p.email, 'No email') as email,
    p.display_name,
    p.first_name,
    p.last_name,
    COALESCE(ur.role::TEXT, 'user') as role,
    p.created_at as signed_up_at,
    p.updated_at as last_sign_in_at,
    'offline'::TEXT as status -- Default status
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  ORDER BY p.created_at DESC;
END;
$$;

-- Add email field to profiles for admin visibility
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Recreate the add_admin_role function with TEXT return type
CREATE OR REPLACE FUNCTION public.add_admin_role(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Only allow existing admins to add other admins (or allow if no admins exist yet)
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') 
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required to add other admins';
  END IF;
  
  -- Find user by email in profiles table
  SELECT user_id INTO target_user_id
  FROM public.profiles 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User with email ' || user_email || ' not found in profiles. Make sure they have signed up and have a profile.';
  END IF;
  
  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'Admin role added successfully to user ' || user_email;
END;
$$;

-- Create a function to promote current user to admin (for initial setup)
CREATE OR REPLACE FUNCTION public.make_me_admin()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if no admins exist yet
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Admin users already exist. Contact an existing admin.';
  END IF;
  
  -- Make current user admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN 'You are now an admin!';
END;
$$;