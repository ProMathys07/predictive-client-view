-- Création de la table users pour gérer les comptes utilisateurs
-- À exécuter dans Supabase SQL Editor

-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS public.users;

-- Créer la table users
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'client')),
    company VARCHAR(255) NOT NULL,
    company_logo TEXT,
    profile_image TEXT,
    status VARCHAR(30) DEFAULT 'actif' CHECK (status IN ('actif', 'en_attente_suppression', 'supprimé', 'restauré')),
    is_temporary_password BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index pour améliorer les performances
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Politique RLS : Les admins peuvent voir tous les utilisateurs
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Politique RLS : Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Politique RLS : Les admins peuvent créer et gérer tous les utilisateurs
CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Insérer un admin par défaut (optionnel)
INSERT INTO public.users (
    id,
    email, 
    name, 
    role, 
    company, 
    status,
    is_temporary_password
) VALUES (
    gen_random_uuid(),
    'admin@aidatapme.com',
    'Administrateur Système',
    'admin',
    'AIDataPME',
    'actif',
    false
) ON CONFLICT (email) DO NOTHING;

-- Commentaires pour la documentation
COMMENT ON TABLE public.users IS 'Table des utilisateurs de la plateforme';
COMMENT ON COLUMN public.users.id IS 'Identifiant unique (UUID)';
COMMENT ON COLUMN public.users.email IS 'Adresse email (unique)';
COMMENT ON COLUMN public.users.name IS 'Nom complet de l''utilisateur';
COMMENT ON COLUMN public.users.role IS 'Rôle de l''utilisateur (admin ou client)';
COMMENT ON COLUMN public.users.company IS 'Nom de l''entreprise';
COMMENT ON COLUMN public.users.status IS 'Statut du compte utilisateur';
COMMENT ON COLUMN public.users.is_temporary_password IS 'Indique si le mot de passe est temporaire';