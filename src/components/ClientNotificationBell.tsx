
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ClientNotification {
  id: string;
  subject: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export default function ClientNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ClientNotification[]>([
    {
      id: '1',
      subject: 'Nouvelle prédiction disponible',
      description: 'Votre modèle de gestion des stocks a généré une nouvelle prédiction',
      timestamp: '5 min',
      read: false
    },
    {
      id: '2',
      subject: 'Objectif trimestriel atteint',
      description: 'Félicitations ! Vous avez atteint votre objectif d\'économie pour la maintenance prédictive',
      timestamp: '2h',
      read: false
    },
    {
      id: '3',
      subject: 'Rapport mensuel disponible',
      description: 'Votre rapport de performance mensuel est maintenant disponible',
      timestamp: '1j',
      read: true
    },
    {
      id: '4',
      subject: 'Mise à jour du modèle',
      description: 'Le modèle d\'optimisation logistique a été mis à jour avec de nouvelles données',
      timestamp: '2j',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-auto">
        <div className="w-[350px] max-h-[400px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} non lues
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
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                            {notification.subject}
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
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
