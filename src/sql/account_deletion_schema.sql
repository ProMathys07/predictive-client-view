-- Schémas de base de données pour la gestion des suppressions de compte
-- À exécuter dans Supabase SQL Editor

-- Table pour les utilisateurs avec statut de compte
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'client')),
    profile_image TEXT,
    company VARCHAR(255) NOT NULL,
    company_logo TEXT,
    status VARCHAR(30) DEFAULT 'actif' CHECK (status IN ('actif', 'en_attente_suppression', 'supprimé', 'restauré')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table pour les demandes de suppression de compte
CREATE TABLE IF NOT EXISTS account_deletion_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_response TEXT,
    processed_by VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table pour les notifications de suppression côté client
CREATE TABLE IF NOT EXISTS account_deletion_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deletion_request_approved', 'deletion_request_rejected')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_client_id ON account_deletion_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON account_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_client_id ON account_deletion_notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON account_deletion_notifications(read);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deletion_requests_updated_at BEFORE UPDATE ON account_deletion_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS (Row Level Security) pour sécuriser l'accès aux données

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_deletion_notifications ENABLE ROW LEVEL SECURITY;

-- Politique pour la table users
-- Les admins peuvent tout voir, les clients ne voient que leurs propres données
CREATE POLICY "Admin can view all users" ON users
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admin can update all users" ON users
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Politique pour la table account_deletion_requests
-- Les admins peuvent tout voir, les clients ne voient que leurs propres demandes
CREATE POLICY "Admin can view all deletion requests" ON account_deletion_requests
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Client can view own deletion requests" ON account_deletion_requests
    FOR SELECT USING (auth.uid()::text = client_id::text);

CREATE POLICY "Client can create deletion requests" ON account_deletion_requests
    FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);

CREATE POLICY "Admin can update deletion requests" ON account_deletion_requests
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Politique pour la table account_deletion_notifications
-- Les clients ne voient que leurs propres notifications, les admins peuvent créer des notifications
CREATE POLICY "Client can view own notifications" ON account_deletion_notifications
    FOR SELECT USING (auth.uid()::text = client_id::text);

CREATE POLICY "Admin can create notifications" ON account_deletion_notifications
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Client can update own notifications" ON account_deletion_notifications
    FOR UPDATE USING (auth.uid()::text = client_id::text);

-- Insérer des données d'exemple pour les tests
INSERT INTO users (id, email, name, role, company, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@aidatapme.com', 'Administrateur Système', 'admin', 'AIDataPME', 'actif'),
    ('550e8400-e29b-41d4-a716-446655440001', 'client@technosolutions.fr', 'Jean Dupont', 'client', 'TechnoSolutions', 'actif'),
    ('550e8400-e29b-41d4-a716-446655440002', 'contact@innovacorp.fr', 'Marie Martin', 'client', 'InnovaCorp', 'actif')
ON CONFLICT (email) DO NOTHING;