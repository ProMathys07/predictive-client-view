import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { AccountDeletionRequest, AccountDeletionNotification, AccountStatus } from '@/types/account';
import { useToast } from '@/hooks/use-toast';

// Configuration Supabase avec fallback pour éviter l'erreur
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Vérifier si Supabase est configuré
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Hook pour gérer les suppressions de compte avec Supabase
export function useSupabaseAccountDeletion() {
  const [deletionRequests, setDeletionRequests] = useState<AccountDeletionRequest[]>([]);
  const [notifications, setNotifications] = useState<AccountDeletionNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger les demandes de suppression (pour admin)
  const loadDeletionRequests = async () => {
    if (!isSupabaseConfigured || !supabase || user?.role !== 'admin') return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeletionRequests(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de suppression",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications pour le client
  const loadClientNotifications = async () => {
    if (!user || user.role !== 'client') return;
    
    try {
      const { data, error } = await supabase
        .from('account_deletion_notifications')
        .select('*')
        .eq('client_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  // Créer une demande de suppression (client)
  const createDeletionRequest = async (reason?: string): Promise<boolean> => {
    if (!user || user.role !== 'client') {
      toast({
        title: "Erreur",
        description: "Seuls les clients peuvent demander la suppression",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      // Vérifier s'il y a déjà une demande en cours
      const { data: existing, error: checkError } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('client_id', user.id)
        .eq('status', 'pending')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        toast({
          title: "Demande existante",
          description: "Vous avez déjà une demande de suppression en cours",
          variant: "destructive"
        });
        return false;
      }

      // Créer la nouvelle demande
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert({
          client_id: user.id,
          client_name: user.name,
          client_email: user.email,
          reason: reason || 'Aucune raison spécifiée',
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande de suppression a été envoyée à l'administrateur",
        variant: "default"
      });

      await loadDeletionRequests();
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de suppression",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Traiter une demande de suppression (admin)
  const processDeletionRequest = async (
    requestId: string,
    action: 'approve' | 'reject',
    adminResponse?: string
  ): Promise<boolean> => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Erreur",
        description: "Seuls les administrateurs peuvent traiter les demandes",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      // Récupérer la demande
      const { data: request, error: requestError } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Mettre à jour la demande
      const { error: updateError } = await supabase
        .from('account_deletion_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_response: adminResponse || `Demande ${action === 'approve' ? 'approuvée' : 'rejetée'}`,
          processed_by: user.name,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Si approuvée, mettre à jour le statut du compte utilisateur
      if (action === 'approve') {
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            status: 'supprimé',
            updated_at: new Date().toISOString()
          })
          .eq('id', request.client_id);

        if (userUpdateError) throw userUpdateError;
      }

      // Créer une notification pour le client
      const { error: notificationError } = await supabase
        .from('account_deletion_notifications')
        .insert({
          type: action === 'approve' ? 'deletion_request_approved' : 'deletion_request_rejected',
          title: action === 'approve' ? 'Compte en cours de suppression' : 'Demande de suppression refusée',
          message: adminResponse || `Votre demande a été ${action === 'approve' ? 'approuvée' : 'refusée'}`,
          client_id: request.client_id,
          read: false
        });

      if (notificationError) throw notificationError;

      toast({
        title: "Demande traitée",
        description: `Demande ${action === 'approve' ? 'approuvée' : 'refusée'} avec succès`,
        variant: "default"
      });

      await loadDeletionRequests();
      return true;
    } catch (error) {
      console.error('Erreur lors du traitement de la demande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter la demande",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer définitivement un compte (admin)
  const permanentDeleteAccount = async (requestId: string): Promise<boolean> => {
    if (!user || user.role !== 'admin') return false;

    try {
      setLoading(true);

      // Récupérer la demande
      const { data: request, error: requestError } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Supprimer définitivement l'utilisateur
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', request.client_id);

      if (deleteError) throw deleteError;

      // Marquer la demande comme complétée
      const { error: completeError } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (completeError) throw completeError;

      toast({
        title: "Suppression définitive",
        description: "Le compte a été supprimé définitivement",
        variant: "default"
      });

      await loadDeletionRequests();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression définitive:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer définitivement le compte",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Restaurer un compte (admin)
  const restoreAccount = async (clientId: string): Promise<boolean> => {
    if (!user || user.role !== 'admin') return false;

    try {
      setLoading(true);

      // Restaurer le statut du compte
      const { error } = await supabase
        .from('users')
        .update({
          status: 'restauré',
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: "Compte restauré",
        description: "Le compte a été restauré avec succès",
        variant: "default"
      });

      await loadDeletionRequests();
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de restaurer le compte",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Marquer une notification comme lue
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('account_deletion_notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  // Vérifier le statut du compte utilisateur
  const checkAccountStatus = async (): Promise<AccountStatus | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data?.status || 'actif';
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return null;
    }
  };

  // Charger les données au montage
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        loadDeletionRequests();
      } else {
        loadClientNotifications();
      }
    }
  }, [user]);

  return {
    // États
    deletionRequests,
    notifications,
    loading,
    
    // Actions client
    createDeletionRequest,
    markNotificationAsRead,
    checkAccountStatus,
    
    // Actions admin
    processDeletionRequest,
    permanentDeleteAccount,
    restoreAccount,
    
    // Utilitaires
    loadDeletionRequests,
    loadClientNotifications,
    
    // Helpers
    getPendingRequests: () => deletionRequests.filter(req => req.status === 'pending'),
    getDeletedAccounts: () => deletionRequests.filter(req => req.status === 'approved'),
    hasActiveDeletionRequest: () => {
      if (!user || user.role !== 'client') return false;
      return deletionRequests.some(req => req.client_id === user.id && req.status === 'pending');
    }
  };
}