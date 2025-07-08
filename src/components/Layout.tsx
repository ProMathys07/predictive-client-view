
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Composant de layout principal pour les pages authentifiées
export default function Layout() {
  const { isAuthenticated, user } = useAuth();
  
  console.log("Layout: Authentication status =", isAuthenticated);

  // Vérification de l'authentification (sécurité supplémentaire)
  if (!isAuthenticated || !user) {
    console.log("Layout: Not authenticated, returning null");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar avec navigation */}
      <Sidebar />
      
      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
