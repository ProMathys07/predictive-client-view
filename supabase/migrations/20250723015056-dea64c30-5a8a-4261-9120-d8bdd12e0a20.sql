-- CORRECTION CRITIQUE : Éviter la récursion infinie dans les politiques RLS
-- 1. Créer un enum pour les rôles
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'client');

-- 2. Créer une table séparée pour les rôles utilisateur
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 3. Activer RLS sur user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Créer une fonction SECURITY DEFINER pour éviter la récursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Créer une fonction pour obtenir le rôle actuel de l'utilisateur
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- 6. Supprimer toutes les anciennes politiques problématiques
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

-- 7. Créer de nouvelles politiques sans récursion
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete users" ON public.users
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 8. Politiques pour user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 9. Supprimer les anciennes politiques account_deletion_requests
DROP POLICY IF EXISTS "Clients can view own deletion requests" ON public.account_deletion_requests;
DROP POLICY IF EXISTS "Clients can create deletion requests" ON public.account_deletion_requests;
DROP POLICY IF EXISTS "Admins can manage all deletion requests" ON public.account_deletion_requests;

-- 10. Créer nouvelles politiques account_deletion_requests
CREATE POLICY "Clients can view own deletion requests" ON public.account_deletion_requests
    FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Clients can create deletion requests" ON public.account_deletion_requests
    FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admins can manage all deletion requests" ON public.account_deletion_requests
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 11. Supprimer les anciennes politiques notifications
DROP POLICY IF EXISTS "Clients can view own notifications" ON public.account_deletion_notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.account_deletion_notifications;

-- 12. Créer nouvelles politiques notifications
CREATE POLICY "Clients can view own notifications" ON public.account_deletion_notifications
    FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON public.account_deletion_notifications
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 13. Migrer les données existantes vers user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.users
ON CONFLICT (user_id, role) DO NOTHING;

-- 14. Index pour performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);