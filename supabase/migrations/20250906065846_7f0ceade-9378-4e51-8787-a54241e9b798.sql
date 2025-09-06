-- Update the profile with the correct email for the authenticated user
UPDATE public.profiles 
SET email = 'teeagbaji@gmail.com' 
WHERE user_id = 'cfb4fd8d-9248-49ed-8cb2-eebcedb2bd26';

-- Assign admin role to the user
INSERT INTO public.user_roles (user_id, role)
VALUES ('cfb4fd8d-9248-49ed-8cb2-eebcedb2bd26', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;