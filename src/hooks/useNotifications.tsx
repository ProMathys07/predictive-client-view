
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'service_created' | 'service_updated' | 'service_deleted' | 'billing_reminder' | 'payment_reminder' | 'invoice_downloaded' | 'login_success' | 'login_failed' | 'client_feedback' | 'client_prediction' | 'client_login' | 'client_data_upload';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  clientId?: string;
  clientName?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Charger les notifications depuis localStorage au démarrage
  const loadNotifications = (): Notification[] => {
    try {
      const stored = localStorage.getItem('admin_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Notification) => {
    console.log('🔔 Nouvelle notification ajoutée:', notification);
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
