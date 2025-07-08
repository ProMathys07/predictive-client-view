
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Composant pour protéger les routes qui nécessitent une authentification
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  
  console.log("ProtectedRoute: Authentication status =", isAuthenticated);

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  console.log("ProtectedRoute: Rendering protected content");
  return <>{children}</>;
}
