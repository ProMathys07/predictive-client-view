import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Notification } from '@/hooks/useNotifications';

interface NotificationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'service_created':
    case 'service_updated':
    case 'service_deleted': return '⚙️';
    case 'client_feedback':
    case 'client_login':
    case 'client_data_upload': return '👤';
    case 'client_prediction': return '🧠';
    case 'billing_reminder':
    case 'payment_reminder':
    case 'invoice_downloaded': return '💰';
    case 'login_success':
    case 'login_failed': return '🔐';
    default: return '📢';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'service_created':
    case 'service_updated':
    case 'service_deleted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'client_feedback':
    case 'client_login':
    case 'client_data_upload': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'client_prediction': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'billing_reminder':
    case 'payment_reminder':
    case 'invoice_downloaded': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'login_success':
    case 'login_failed': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export default function NotificationHistoryModal({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead 
}: NotificationHistoryModalProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  return (
    <>
      {/* Modal principal avec historique complet */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🔔 Historique des notifications
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {notifications.filter(n => !n.read).length} non lues sur {notifications.length} au total
            </p>
          </DialogHeader>
          
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-4">📭</div>
                  <p>Aucune notification pour le moment</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      !notification.read 
                        ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => {
                      console.log("🔍 Notification historique cliquée:", notification);
                      console.log("🔍 Description complète:", notification.description);
                      setSelectedNotification(notification);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {notification.clientName ? (
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {notification.clientName?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(notification.timestamp).toLocaleString('fr-FR')}
                            </span>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {notification.description.length > 200 
                            ? `${notification.description.substring(0, 200)}...` 
                            : notification.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getNotificationColor(notification.type)}`}
                          >
                            {notification.type}
                          </Badge>
                          
                          {notification.clientName && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              Client: {notification.clientName}
                            </span>
                          )}
                          
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="text-xs"
                            >
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal détail d'une notification */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              💬 {selectedNotification?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedNotification?.description}</p>
            </div>
            {selectedNotification?.clientName && (
              <div className="text-sm text-blue-600 dark:text-blue-400">
                <strong>Client:</strong> {selectedNotification.clientName}
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                <strong>Date:</strong> {selectedNotification && new Date(selectedNotification.timestamp).toLocaleString('fr-FR')}
              </span>
              <Badge 
                variant="outline" 
                className={`${selectedNotification && getNotificationColor(selectedNotification.type)}`}
              >
                {selectedNotification?.type}
              </Badge>
            </div>
            {selectedNotification && !selectedNotification.read && (
              <Button
                onClick={() => {
                  onMarkAsRead(selectedNotification.id);
                  setSelectedNotification(null);
                }}
                className="w-full"
              >
                ✅ Marquer comme lu
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}