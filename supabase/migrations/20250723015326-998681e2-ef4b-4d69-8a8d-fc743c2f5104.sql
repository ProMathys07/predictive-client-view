-- Nettoyer les utilisateurs orphelins (sans compte auth correspondant)
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM auth.users);

-- Créer le compte auth.users pour l'admin s'il n'existe pas
-- (Note: ceci ne peut pas être fait via SQL car auth.users est géré par Supabase Auth)