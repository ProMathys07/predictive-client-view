import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faTrash, 
  faCheck, 
  faTimes,
  faShieldAlt 
} from '@fortawesome/free-solid-svg-icons';
import { AccountDeletionRequest } from '@/hooks/useAccountDeletion';

// Interface pour les props du modal de suppression de compte
interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AccountDeletionRequest | null;
  onApprove: (requestId: string, adminResponse: string) => void;
  onReject: (requestId: string, adminResponse: string) => void;
  onConfirmDeletion: (requestId: string) => void;
}

// Modal pour gérer les demandes de suppression de compte côté admin
// Permet d'approuver, rejeter ou confirmer définitivement la suppression
export default function AccountDeletionModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
  onConfirmDeletion
}: AccountDeletionModalProps) {
  // États pour gérer les réponses admin et la confirmation
  const [adminResponse, setAdminResponse] = useState('');
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  // Réinitialiser les états quand le modal se ferme
  const handleClose = () => {
    setAdminResponse('');
    setShowFinalConfirmation(false);
    setConfirmationText('');
    onClose();
  };

  // Gérer l'approbation de la demande
  const handleApprove = () => {
    if (!request) return;
    onApprove(request.id, adminResponse || 'Demande approuvée par l\'administrateur');
    setShowFinalConfirmation(true);
  };

  // Gérer le rejet de la demande
  const handleReject = () => {
    if (!request) return;
    onReject(request.id, adminResponse || 'Demande rejetée par l\'administrateur');
    handleClose();
  };

  // Gérer la confirmation finale de suppression
  const handleFinalConfirmation = () => {
    if (!request || confirmationText !== 'SUPPRIMER DÉFINITIVEMENT') return;
    onConfirmDeletion(request.id);
    handleClose();
  };

  if (!request) return null;

  // Formatage de la date de demande
  const requestDate = new Date(request.requestDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {/* En-tête avec icône d'alerte */}
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="h-6 w-6 text-red-600 dark:text-red-400" 
              />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {showFinalConfirmation ? 'Confirmation finale' : 'Demande de suppression de compte'}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                {showFinalConfirmation 
                  ? 'Cette action est irréversible' 
                  : `Demande reçue le ${requestDate}`
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {showFinalConfirmation ? (
          // Écran de confirmation finale
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon 
                  icon={faShieldAlt} 
                  className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" 
                />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-300">
                    Action irréversible
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Le compte de <strong>{request.clientName}</strong> sera définitivement supprimé. 
                    Toutes ses données seront perdues.
                  </p>
                </div>
              </div>
            </div>

            {/* Champ de confirmation */}
            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Tapez <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">SUPPRIMER DÉFINITIVEMENT</code> pour confirmer
              </Label>
              <input
                id="confirmation"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                placeholder="SUPPRIMER DÉFINITIVEMENT"
              />
            </div>

            {/* Boutons de confirmation finale */}
            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleFinalConfirmation}
                disabled={confirmationText !== 'SUPPRIMER DÉFINITIVEMENT'}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                Supprimer définitivement
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // Écran principal de traitement de la demande
          <div className="space-y-4">
            {/* Informations du client */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Informations du client
              </h4>
              <div className="space-y-1 text-sm">
                <p><strong>Nom :</strong> {request.clientName}</p>
                <p><strong>Email :</strong> {request.clientEmail}</p>
                <p><strong>Date de demande :</strong> {requestDate}</p>
              </div>
            </div>

            {/* Raison de la suppression */}
            {request.reason && (
              <div>
                <Label className="text-sm font-medium">Raison de la suppression :</Label>
                <div className="mt-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    {request.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Réponse admin optionnelle */}
            <div className="space-y-2">
              <Label htmlFor="admin-response">
                Réponse administrateur (optionnel)
              </Label>
              <Textarea
                id="admin-response"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Commentaire ou justification de votre décision..."
                rows={3}
              />
            </div>

            {/* Boutons d'action */}
            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                <FontAwesomeIcon icon={faTimes} className="mr-2 h-4 w-4" />
                Rejeter
              </Button>
              <Button onClick={handleApprove}>
                <FontAwesomeIcon icon={faCheck} className="mr-2 h-4 w-4" />
                Approuver
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}