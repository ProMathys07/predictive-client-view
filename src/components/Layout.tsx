
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

// Composant de layout principal pour les pages authentifiées
export default function Layout() {
  const { isAuthenticated } = useAuth();

  // Vérification de l'authentification (sécurité supplémentaire)
  if (!isAuthenticated) {
    return null;
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
