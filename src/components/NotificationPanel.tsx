import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'system' | 'client' | 'model' | 'connection' | 'prediction';
  title: string;
  description: string;
  timestamp: string;
  clientName?: string;
  clientAvatar?: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: 'Importation terminée',
    description: 'Le dataset "Ventes Q4" a été importé avec succès',
    timestamp: '2 min',
    read: false
  },
  {
    id: '2',
    type: 'client',
    title: 'Nouvelle connexion',
    description: 'TechCorp s\'est connecté à la plateforme',
    timestamp: '15 min',
    clientName: 'TechCorp',
    clientAvatar: '/placeholder.svg',
    read: false
  },
  {
    id: '3',
    type: 'model',
    title: 'Drift détecté',
    description: 'Le modèle de prédiction montre des signes de dérive',
    timestamp: '1h',
    read: true
  },
  {
    id: '4',
    type: 'prediction',
    title: 'Prédiction terminée',
    description: 'DataFlow a exécuté 150 nouvelles prédictions',
    timestamp: '2h',
    clientName: 'DataFlow',
    read: true
  },
  {
    id: '5',
    type: 'system',
    title: 'Mise à jour disponible',
    description: 'Une nouvelle version du système est disponible',
    timestamp: '3h',
    read: true
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'system': return '⚙️';
    case 'client': return '👤';
    case 'model': return '🧠';
    case 'connection': return '🔗';
    case 'prediction': return '📊';
    default: return '📢';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'system': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'client': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'model': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'connection': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'prediction': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export default function NotificationPanel({ notifications = mockNotifications, onMarkAsRead }: NotificationPanelProps) {
  return (
    <div className="w-[350px] max-h-[400px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {notifications.filter(n => !n.read).length} non lues
        </p>
      </div>
      
      <ScrollArea className="h-[320px]" type="scroll">
        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {notification.clientAvatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.clientAvatar} alt={notification.clientName} />
                      <AvatarFallback>
                        {notification.clientName?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.timestamp}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notification.description}
                    </p>
                    
                    <div className="mt-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getNotificationColor(notification.type)}`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
