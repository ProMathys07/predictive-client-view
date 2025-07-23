import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faLock } from '@fortawesome/free-solid-svg-icons';

interface TemporaryPasswordNotificationProps {
  onChangePassword: () => void;
}

export default function TemporaryPasswordNotification({ onChangePassword }: TemporaryPasswordNotificationProps) {
  const { user } = useAuth();

  if (!user || !user.isTemporaryPassword) {
    return null;
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 dark:text-orange-200">
        Mot de passe temporaire détecté
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-300">
        <p className="mb-2">
          Votre compte utilise un mot de passe temporaire. Pour des raisons de sécurité, 
          vous devez le changer avant de continuer à utiliser la plateforme.
        </p>
        <Button 
          onClick={onChangePassword}
          variant="outline"
          size="sm"
          className="border-orange-300 text-orange-800 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-200 dark:hover:bg-orange-900"
        >
          <FontAwesomeIcon icon={faLock} className="mr-2 h-4 w-4" />
          Changer mon mot de passe
        </Button>
      </AlertDescription>
    </Alert>
  );
}