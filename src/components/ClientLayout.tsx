import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ClientSidebar from './ClientSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Layout pour les pages client
export default function ClientLayout() {
  const { isAuthenticated, user } = useAuth();
  
  console.log("ClientLayout: Authentication status =", isAuthenticated);

  // Vérification de l'authentification et du rôle client
  if (!isAuthenticated || !user || user.role !== 'client') {
    console.log("ClientLayout: Not authenticated or not a client, returning null");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="h-8 w-8 text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Vérification des accès client...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar client avec navigation */}
      <ClientSidebar />
      
      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}