-- CORRECTION URGENTE : Recréer les comptes admin et client manquants

-- 1. Créer l'utilisateur admin dans la table users
INSERT INTO public.users (
    id, 
    email, 
    name, 
    company, 
    status, 
    is_temporary_password,
    created_at,
    updated_at
) VALUES (
    'a313ca34-5eff-4a2f-921e-cc0e0748da7f', -- ID existant dans auth.users
    'promathys07@gmail.com',
    'Administrateur Système',
    'AIDataPME',
    'actif',
    false,
    NOW(),
    NOW()
);

-- 2. Assigner le rôle admin
INSERT INTO public.user_roles (user_id, role) 
VALUES ('a313ca34-5eff-4a2f-921e-cc0e0748da7f', 'admin');

-- 3. Créer un compte client de test (sera créé dans auth.users séparément)
INSERT INTO public.users (
    id, 
    email, 
    name, 
    company, 
    status, 
    is_temporary_password,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'client@technosolutions.fr',
    'Jean Dupont',
    'TechnoSolutions',
    'actif',
    false,
    NOW(),
    NOW()
) RETURNING id;

-- 4. Note: Les comptes auth.users pour les tests doivent être créés via l'interface admin