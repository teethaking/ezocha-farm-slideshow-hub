-- Make teeagbaji@gmail.com the main admin
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role
FROM public.profiles 
WHERE email = 'teeagbaji@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;