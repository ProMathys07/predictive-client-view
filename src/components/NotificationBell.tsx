
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
import { useNotifications } from '@/hooks/useNotifications';
import NotificationHistoryModal from './NotificationHistoryModal';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <>
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
            notifications={notifications.slice(0, 5)} // Afficher seulement les 5 plus récentes
            onMarkAsRead={markAsRead}
          />
          {/* Bouton pour voir toutes les notifications */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full text-sm"
              onClick={() => {
                setIsHistoryOpen(true);
                setIsOpen(false); // Fermer le popover
              }}
            >
              Voir toutes les notifications
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Modal historique des notifications */}
      <NotificationHistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />
    </>
  );
}
