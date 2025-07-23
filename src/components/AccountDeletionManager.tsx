import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Trash2, RotateCcw, MessageSquare, Calendar, User, Mail } from 'lucide-react';
import { useSupabaseAccountDeletion } from '@/hooks/useSupabaseAccountDeletion';
import { AccountDeletionRequest } from '@/types/account';
import { formatDate } from '@/lib/utils';

// Composant principal pour la gestion des suppressions côté admin
export default function AccountDeletionManager() {
  const {
    deletionRequests,
    loading,
    processDeletionRequest,
    permanentDeleteAccount,
    restoreAccount,
    getPendingRequests,
    getDeletedAccounts
  } = useSupabaseAccountDeletion();

  const [selectedRequest, setSelectedRequest] = useState<AccountDeletionRequest | null>(null);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState<'approve' | 'reject' | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const pendingRequests = getPendingRequests();
  const deletedAccounts = getDeletedAccounts();

  // Gestionnaire pour traiter une demande
  const handleProcessRequest = (request: AccountDeletionRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setProcessingAction(action);
    setAdminResponse('');
    setShowProcessDialog(true);
  };

  // Confirmer le traitement de la demande
  const confirmProcessRequest = async () => {
    if (!selectedRequest || !processingAction) return;

    const success = await processDeletionRequest(
      selectedRequest.id,
      processingAction,
      adminResponse
    );

    if (success) {
      setShowProcessDialog(false);
      setSelectedRequest(null);
      setProcessingAction(null);
      setAdminResponse('');
    }
  };

  // Gestionnaire pour supprimer définitivement
  const handlePermanentDelete = (request: AccountDeletionRequest) => {
    setSelectedRequest(request);
    setShowDeleteConfirm(true);
  };

  // Confirmer la suppression définitive
  const confirmPermanentDelete = async () => {
    if (!selectedRequest) return;

    const success = await permanentDeleteAccount(selectedRequest.id);
    if (success) {
      setShowDeleteConfirm(false);
      setSelectedRequest(null);
    }
  };

  // Gestionnaire pour restaurer un compte
  const handleRestoreAccount = (request: AccountDeletionRequest) => {
    setSelectedRequest(request);
    setShowRestoreConfirm(true);
  };

  // Confirmer la restauration
  const confirmRestoreAccount = async () => {
    if (!selectedRequest) return;

    const success = await restoreAccount(selectedRequest.client_id);
    if (success) {
      setShowRestoreConfirm(false);
      setSelectedRequest(null);
    }
  };

  // Composant pour afficher une demande
  const RequestCard = ({ request, showActions = true }: { request: AccountDeletionRequest; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">{request.client_name}</CardTitle>
            <Badge variant={
              request.status === 'pending' ? 'default' :
              request.status === 'approved' ? 'destructive' :
              request.status === 'rejected' ? 'secondary' : 'outline'
            }>
              {request.status === 'pending' ? 'En attente' :
               request.status === 'approved' ? 'Approuvée' :
               request.status === 'rejected' ? 'Refusée' : 'Terminée'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(request.created_at)}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Mail className="w-3 h-3" />
          {request.client_email}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {request.reason && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Raison :</p>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {request.reason}
            </p>
          </div>
        )}

        {request.admin_response && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">Réponse administrateur :</p>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {request.admin_response}
            </p>
            {request.processed_by && (
              <p className="text-xs text-muted-foreground mt-1">
                Traité par {request.processed_by} le {formatDate(request.processed_at!)}
              </p>
            )}
          </div>
        )}

        {showActions && request.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleProcessRequest(request, 'approve')}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Approuver
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleProcessRequest(request, 'reject')}
              className="flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              Refuser
            </Button>
          </div>
        )}

        {showActions && request.status === 'approved' && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handlePermanentDelete(request)}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Supprimer définitivement
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRestoreAccount(request)}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading && deletionRequests.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Chargement des demandes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h2 className="text-xl font-semibold">Gestion des suppressions de compte</h2>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Demandes en attente
            {pendingRequests.length > 0 && (
              <Badge variant="default" className="ml-1">{pendingRequests.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="deleted" className="flex items-center gap-2">
            Comptes supprimés
            {deletedAccounts.length > 0 && (
              <Badge variant="secondary" className="ml-1">{deletedAccounts.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Aucune demande en attente</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deleted" className="mt-6">
          {deletedAccounts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Aucun compte supprimé</p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {deletedAccounts.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog pour traiter une demande */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {processingAction === 'approve' ? 'Approuver' : 'Refuser'} la demande
            </DialogTitle>
            <DialogDescription>
              {processingAction === 'approve' 
                ? 'Le compte sera désactivé et le client perdra l\'accès immédiatement.'
                : 'La demande sera refusée et le client en sera notifié.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message pour le client :</label>
              <Textarea
                placeholder={processingAction === 'approve' 
                  ? "Votre demande a été approuvée. Votre compte sera supprimé."
                  : "Votre demande a été refusée pour les raisons suivantes..."
                }
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant={processingAction === 'approve' ? 'destructive' : 'default'}
              onClick={confirmProcessRequest}
              disabled={loading}
            >
              {processingAction === 'approve' ? 'Approuver' : 'Refuser'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour confirmer la suppression définitive */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Suppression définitive</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le compte de {selectedRequest?.client_name} sera supprimé définitivement de la base de données.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Attention</span>
            </div>
            <p className="text-sm mt-1">
              Toutes les données associées à ce compte seront perdues définitivement.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmPermanentDelete}
              disabled={loading}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour confirmer la restauration */}
      <Dialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurer le compte</DialogTitle>
            <DialogDescription>
              Le compte de {selectedRequest?.client_name} sera restauré et le client pourra à nouveau se connecter.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreConfirm(false)}>
              Annuler
            </Button>
            <Button 
              onClick={confirmRestoreAccount}
              disabled={loading}
            >
              Restaurer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}