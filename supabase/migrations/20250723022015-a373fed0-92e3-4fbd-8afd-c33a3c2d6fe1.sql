-- CORRECTION URGENTE : Corriger la structure et recréer les comptes

-- 1. D'abord, supprimer la contrainte NOT NULL sur role dans users (si elle existe encore)
ALTER TABLE public.users ALTER COLUMN role DROP NOT NULL;

-- 2. Créer l'utilisateur admin dans la table users
INSERT INTO public.users (
    id, 
    email, 
    name, 
    role,
    company, 
    status, 
    is_temporary_password,
    created_at,
    updated_at
) VALUES (
    'a313ca34-5eff-4a2f-921e-cc0e0748da7f', -- ID existant dans auth.users
    'promathys07@gmail.com',
    'Administrateur Système',
    'admin',
    'AIDataPME',
    'actif',
    false,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    company = EXCLUDED.company,
    updated_at = NOW();

-- 3. Assigner le rôle admin
INSERT INTO public.user_roles (user_id, role) 
VALUES ('a313ca34-5eff-4a2f-921e-cc0e0748da7f', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;