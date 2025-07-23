import React, { useState } from 'react';
import { useSupabaseAccountDeletion } from '@/hooks/useSupabaseAccountDeletion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function ClientAccountDeletionRequest() {
  const { createDeletionRequest, hasActiveDeletionRequest, loading } = useSupabaseAccountDeletion();
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createDeletionRequest(reason);
    if (success) {
      setReason('');
      setShowForm(false);
    }
  };

  if (!user || user.role !== 'client') {
    return null;
  }

  const hasActiveRequest = hasActiveDeletionRequest();

  return (
    <Card className="w-full max-w-2xl border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
          Suppression de compte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasActiveRequest ? (
          <Alert>
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
            <AlertDescription>
              Vous avez déjà une demande de suppression en cours de traitement. 
              Vous recevrez une notification dès qu'elle sera traitée par l'administrateur.
            </AlertDescription>
          </Alert>
        ) : !showForm ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
            </p>
            <Button 
              variant="destructive"
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
              Demander la suppression de mon compte
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Raison de la suppression (optionnel)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Pourquoi souhaitez-vous supprimer votre compte ?"
                rows={3}
              />
            </div>
            
            <Alert>
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
              <AlertDescription>
                Cette action est irréversible. Votre demande sera examinée par un administrateur.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                variant="destructive" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2 h-4 w-4" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                    Confirmer la demande
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                Annuler
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}