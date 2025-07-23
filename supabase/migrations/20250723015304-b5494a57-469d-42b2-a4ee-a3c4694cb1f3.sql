-- Migration des données existantes vers user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::public.app_role 
FROM public.users 
WHERE role IN ('admin', 'client')
ON CONFLICT (user_id, role) DO NOTHING;

-- Supprimer la colonne role de users (maintenant obsolète)
ALTER TABLE public.users DROP COLUMN IF EXISTS role;