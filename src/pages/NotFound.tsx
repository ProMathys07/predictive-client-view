
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

// Page 404 avec navigation de retour
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Accueil</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
