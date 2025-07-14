
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
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'system' as const,
      title: 'Importation terminée',
      description: 'Le dataset "Ventes Q4" a été importé avec succès',
      timestamp: '2 min',
      read: false
    },
    {
      id: '2',
      type: 'client' as const,
      title: 'Nouvelle connexion',
      description: 'TechCorp s\'est connecté à la plateforme',
      timestamp: '15 min',
      clientName: 'TechCorp',
      read: false
    },
    {
      id: '3',
      type: 'model' as const,
      title: 'Drift détecté',
      description: 'Le modèle de prédiction montre des signes de dérive',
      timestamp: '1h',
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
        <NotificationPanel 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
        />
      </PopoverContent>
    </Popover>
  );
}
