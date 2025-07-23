import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSupabaseAccountDeletion } from '@/hooks/useSupabaseAccountDeletion';
import { formatDate } from '@/lib/utils';

// Composant pour afficher les notifications de suppression côté client
export default function ClientAccountNotifications() {
  const {
    notifications,
    markNotificationAsRead,
    checkAccountStatus,
    hasActiveDeletionRequest
  } = useSupabaseAccountDeletion();

  const [accountStatus, setAccountStatus] = React.useState<string | null>(null);

  // Vérifier le statut du compte au chargement
  React.useEffect(() => {
    const checkStatus = async () => {
      const status = await checkAccountStatus();
      setAccountStatus(status);
    };
    checkStatus();
  }, []);

  // Gestionnaire pour marquer une notification comme lue
  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
  };

  // Si le compte est supprimé, afficher un message de blocage
  if (accountStatus === 'supprimé') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Compte en cours de suppression</CardTitle>
            <CardDescription>
              Votre demande de suppression a été approuvée par l'administrateur.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Votre compte a été désactivé et sera supprimé définitivement. 
              Vous n'avez plus accès à vos données.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              Quitter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Afficher les notifications s'il y en a
  if (notifications.length === 0 && !hasActiveDeletionRequest()) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Notification pour demande en cours */}
      {hasActiveDeletionRequest() && (
        <Card className="border-warning">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <CardTitle className="text-base">Demande de suppression en cours</CardTitle>
              <Badge variant="outline" className="border-warning text-warning">
                En attente
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Votre demande de suppression de compte a été envoyée à l'administrateur. 
              Vous recevrez une notification une fois qu'elle aura été traitée.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notifications de réponse admin */}
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`${
            notification.type === 'deletion_request_approved' 
              ? 'border-destructive' 
              : 'border-secondary'
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification.type === 'deletion_request_approved' ? (
                  <XCircle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <CardTitle className="text-base">{notification.title}</CardTitle>
                <Badge 
                  variant={
                    notification.type === 'deletion_request_approved' 
                      ? 'destructive' 
                      : 'secondary'
                  }
                >
                  {notification.type === 'deletion_request_approved' ? 'Approuvée' : 'Refusée'}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(notification.created_at)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{notification.message}</p>
            
            {notification.type === 'deletion_request_approved' && (
              <div className="bg-destructive/10 p-3 rounded border border-destructive/20 mb-4">
                <div className="flex items-center gap-2 text-destructive mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">Important</span>
                </div>
                <p className="text-xs">
                  Votre compte sera bientôt désactivé. Sauvegardez vos données importantes avant la suppression définitive.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                Marquer comme lu
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}