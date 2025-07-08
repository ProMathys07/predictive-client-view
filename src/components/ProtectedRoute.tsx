
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Composant pour protéger les routes qui nécessitent une authentification
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  
  console.log("ProtectedRoute: Authentication status =", isAuthenticated);

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Vérification supplémentaire que l'utilisateur existe bien
  if (!user) {
    console.log("ProtectedRoute: User object missing, showing loading");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Chargement des données utilisateur...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  console.log("ProtectedRoute: Rendering protected content");
  return <>{children}</>;
}
