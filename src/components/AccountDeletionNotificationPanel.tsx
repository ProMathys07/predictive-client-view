import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faExclamationTriangle, 
  faUser,
  faCalendarAlt,
  faCheck,
  faTimes,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useSupabaseAccountDeletion } from '@/hooks/useSupabaseAccountDeletion';
import AccountDeletionModal from './AccountDeletionModal';

// Panneau de notifications pour les demandes de suppression de compte
// Affiché dans l'interface admin pour traiter les demandes clients
export default function AccountDeletionNotificationPanel() {
  // États pour la gestion du modal et des demandes
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Hook pour gérer les demandes de suppression
  const { 
    getPendingRequests, 
    processDeletionRequest,
    loading
  } = useSupabaseAccountDeletion();

  // Obtenir toutes les demandes en attente
  const pendingRequests = getPendingRequests();

  // Gérer l'ouverture du modal pour une demande spécifique
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // Gérer l'approbation d'une demande
  const handleApproveRequest = async (requestId, adminResponse) => {
    try {
      await processDeletionRequest(requestId, 'approve', adminResponse);
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  // Gérer le rejet d'une demande
  const handleRejectRequest = async (requestId, adminResponse) => {
    try {
      await processDeletionRequest(requestId, 'reject', adminResponse);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };

  // Formater la date de demande
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ne rien afficher s'il n'y a pas de demandes en attente
  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <>
      {/* Carte principale des notifications de suppression */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <CardTitle className="text-red-800 dark:text-red-300 flex items-center">
            <FontAwesomeIcon icon={faTrash} className="mr-2 h-5 w-5" />
            Demandes de suppression de compte
            <Badge variant="destructive" className="ml-2">
              {pendingRequests.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Avertissement de sécurité */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
            <div className="flex items-start">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" 
              />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Action irréversible :</strong> La suppression d'un compte efface définitivement 
                toutes les données du client.
              </p>
            </div>
          </div>

          {/* Liste des demandes en attente */}
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div 
                key={request.id}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Informations de la demande */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-gray-500" />
                       <span className="font-medium text-gray-900 dark:text-white">
                         {request.client_name}
                       </span>
                      <Badge variant="outline" className="text-xs">
                        {request.status === 'pending' ? 'En attente' : request.status}
                      </Badge>
                    </div>
                    
                     <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                       <span className="flex items-center">
                         <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 mr-1" />
                         {formatDate(request.created_at)}
                       </span>
                       <span>{request.client_email}</span>
                     </div>
                    
                    {/* Aperçu de la raison (tronquée) */}
                    {request.reason && request.reason !== 'Aucune raison spécifiée' && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                        Raison : {request.reason.substring(0, 50)}
                        {request.reason.length > 50 && '...'}
                      </p>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewRequest(request)}
                    >
                      <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                      Examiner
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal pour traiter les demandes de suppression */}
      <AccountDeletionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onConfirmDeletion={() => {}}
      />
    </>
  );
}