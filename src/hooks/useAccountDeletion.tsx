import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Interface pour les demandes de suppression de compte
export interface AccountDeletionRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  reason?: string; // Raison optionnelle de la suppression
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminResponse?: string;
  processedAt?: string;
  processedBy?: string;
}

// Hook personnalisé pour gérer les demandes de suppression de compte
export function useAccountDeletion(addNotification?: (notification: any) => void) {
  // État pour stocker toutes les demandes de suppression
  const [deletionRequests, setDeletionRequests] = useState<AccountDeletionRequest[]>([]);
  const { user } = useAuth();

  // Charger les demandes depuis le localStorage au démarrage
  useEffect(() => {
    const loadRequests = () => {
      try {
        const stored = localStorage.getItem('account_deletion_requests');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    };
    
    setDeletionRequests(loadRequests());
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('account_deletion_requests', JSON.stringify(deletionRequests));
  }, [deletionRequests]);

  // Fonction pour qu'un client crée une demande de suppression
  const createDeletionRequest = (reason?: string) => {
    if (!user || user.role !== 'client') {
      console.error('Seuls les clients peuvent demander la suppression de leur compte');
      return null;
    }

    // Vérifier s'il y a déjà une demande en cours pour ce client
    const existingRequest = deletionRequests.find(
      req => req.clientId === user.id && req.status === 'pending'
    );

    if (existingRequest) {
      console.log('Une demande de suppression est déjà en cours pour ce client');
      return existingRequest;
    }

    // Créer une nouvelle demande de suppression
    const newRequest: AccountDeletionRequest = {
      id: `del_${Date.now()}`,
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      reason: reason || 'Aucune raison spécifiée',
      requestDate: new Date().toISOString(),
      status: 'pending'
    };

    // Ajouter la demande à la liste
    setDeletionRequests(prev => [newRequest, ...prev]);

    // Créer une notification pour l'admin si la fonction est disponible
    if (addNotification) {
      const notificationData = {
        id: `account_deletion_${newRequest.id}`,
        type: 'account_deletion_request',
        title: `Demande de suppression de compte`,
        description: `${user.name} (${user.email}) a demandé la suppression de son compte.\n\nRaison: ${reason || 'Aucune raison spécifiée'}`,
        timestamp: new Date().toISOString(),
        read: false,
        clientId: user.id,
        clientName: user.name
      };
      console.log('🗑️ Notification de suppression de compte envoyée:', notificationData);
      addNotification(notificationData);
    }

    return newRequest;
  };

  // Fonction pour que l'admin traite une demande (approuver/rejeter)
  const processDeletionRequest = (
    requestId: string, 
    action: 'approve' | 'reject',
    adminResponse?: string,
    adminName?: string
  ) => {
    setDeletionRequests(prev => 
      prev.map(request => {
        if (request.id === requestId) {
          return {
            ...request,
            status: action === 'approve' ? 'approved' : 'rejected',
            adminResponse: adminResponse || `Demande ${action === 'approve' ? 'approuvée' : 'rejetée'} par l'administrateur`,
            processedAt: new Date().toISOString(),
            processedBy: adminName || 'Administrateur'
          };
        }
        return request;
      })
    );

    console.log(`📋 Demande de suppression ${requestId} ${action === 'approve' ? 'approuvée' : 'rejetée'}`);
  };

  // Fonction pour finaliser la suppression d'un compte (confirmation admin)
  const completeDeletion = (requestId: string) => {
    setDeletionRequests(prev => 
      prev.map(request => {
        if (request.id === requestId && request.status === 'approved') {
          return {
            ...request,
            status: 'completed',
            processedAt: new Date().toISOString()
          };
        }
        return request;
      })
    );

    console.log(`✅ Suppression de compte finalisée pour la demande ${requestId}`);
  };

  // Obtenir les demandes en attente pour l'admin
  const getPendingRequests = () => {
    return deletionRequests.filter(req => req.status === 'pending');
  };

  // Obtenir la demande en cours pour un client spécifique
  const getClientPendingRequest = (clientId: string) => {
    return deletionRequests.find(
      req => req.clientId === clientId && req.status === 'pending'
    );
  };

  // Vérifier si le client actuel a une demande en cours
  const hasActiveDeletionRequest = () => {
    if (!user || user.role !== 'client') return false;
    return !!getClientPendingRequest(user.id);
  };

  return {
    deletionRequests,
    createDeletionRequest,
    processDeletionRequest,
    completeDeletion,
    getPendingRequests,
    getClientPendingRequest,
    hasActiveDeletionRequest
  };
}