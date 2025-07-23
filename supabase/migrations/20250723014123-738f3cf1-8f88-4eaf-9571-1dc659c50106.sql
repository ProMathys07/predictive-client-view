-- Création de la table users pour gérer les comptes utilisateurs
CREATE TABLE IF NOT EXISTS public.users (
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
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

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

-- Créer la table des demandes de suppression de compte
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_response TEXT,
    processed_by UUID,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les demandes de suppression
CREATE INDEX IF NOT EXISTS idx_deletion_requests_client_id ON public.account_deletion_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON public.account_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_created_at ON public.account_deletion_requests(created_at);

-- Trigger pour updated_at sur account_deletion_requests
DROP TRIGGER IF EXISTS update_deletion_requests_updated_at ON public.account_deletion_requests;
CREATE TRIGGER update_deletion_requests_updated_at 
    BEFORE UPDATE ON public.account_deletion_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS pour account_deletion_requests
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Clients can view own deletion requests" ON public.account_deletion_requests;
DROP POLICY IF EXISTS "Clients can create deletion requests" ON public.account_deletion_requests;
DROP POLICY IF EXISTS "Admins can manage all deletion requests" ON public.account_deletion_requests;

-- Politiques RLS pour les demandes de suppression
CREATE POLICY "Clients can view own deletion requests" ON public.account_deletion_requests
    FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Clients can create deletion requests" ON public.account_deletion_requests
    FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can manage all deletion requests" ON public.account_deletion_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Créer la table des notifications de suppression de compte
CREATE TABLE IF NOT EXISTS public.account_deletion_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('deletion_request_approved', 'deletion_request_rejected')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    client_id UUID NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les notifications
CREATE INDEX IF NOT EXISTS idx_notifications_client_id ON public.account_deletion_notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.account_deletion_notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.account_deletion_notifications(created_at);

-- RLS pour account_deletion_notifications
ALTER TABLE public.account_deletion_notifications ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Clients can view own notifications" ON public.account_deletion_notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.account_deletion_notifications;

-- Politiques RLS pour les notifications
CREATE POLICY "Clients can view own notifications" ON public.account_deletion_notifications
    FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON public.account_deletion_notifications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Insérer un admin par défaut
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