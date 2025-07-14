
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faRobot, faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface Notification {
  id: string;
  type: 'system' | 'client' | 'model' | 'email';
  title: string;
  description: string;
  timestamp: string;
  clientName?: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'client':
      return faUser;
    case 'model':
      return faRobot;
    case 'email':
      return faEnvelope;
    default:
      return faCog;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'client':
      return 'text-blue-500';
    case 'model':
      return 'text-purple-500';
    case 'email':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export default function NotificationPanel({ notifications, onMarkAsRead }: NotificationPanelProps) {
  return (
    <div className="w-[350px] bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {notifications.filter(n => !n.read).length}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                      <FontAwesomeIcon 
                        icon={getNotificationIcon(notification.type)} 
                        className="h-4 w-4" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </p>
                          <p className={`text-xs mt-1 ${
                            notification.read ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {notification.description}
                          </p>
                          {notification.clientName && (
                            <p className="text-xs text-blue-600 mt-1">
                              Client: {notification.clientName}
                            </p>
                          )}
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <span className="text-xs text-gray-400">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 text-xs h-6 px-2"
                          onClick={() => onMarkAsRead(notification.id)}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full text-sm">
          Voir toutes les notifications
        </Button>
      </div>
    </div>
  );
}
