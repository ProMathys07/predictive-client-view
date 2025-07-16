import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ClientSidebar from './ClientSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Layout pour les pages client
export default function ClientLayout() {
  const { isAuthenticated, user } = useAuth();
  
  console.log("ClientLayout: Authentication status =", isAuthenticated);

  // Vérification de l'authentification et du rôle client
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'client') {
    return <Navigate to="/" replace />;
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