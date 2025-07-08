
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Composant pour protéger les routes qui nécessitent une authentification
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  return <>{children}</>;
}
