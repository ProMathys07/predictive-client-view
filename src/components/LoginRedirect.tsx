import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Composant pour rediriger automatiquement selon le rôle après login
export default function LoginRedirect() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const currentPath = window.location.pathname;
      
      // Éviter les redirections en boucle
      if (currentPath === '/login') {
        // Redirection selon le rôle
        if (user.role === 'admin') {
          navigate('/', { replace: true });
        } else if (user.role === 'client') {
          navigate('/client/dashboard', { replace: true });
        }
      }
    }
  }, [isAuthenticated, user, navigate]);

  return null; // Ce composant ne rend rien
}