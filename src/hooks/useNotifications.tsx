
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Interface pour les notifications du système
// Comprend tous les types de notifications possibles, y compris les nouvelles demandes de suppression de compte
export interface Notification {
  id: string;
  type: 'service_created' | 'service_updated' | 'service_deleted' | 'billing_reminder' | 'payment_reminder' | 'invoice_downloaded' | 'login_success' | 'login_failed' | 'client_feedback' | 'client_prediction' | 'client_login' | 'client_data_upload' | 'account_deletion_request';
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

// Fournisseur de contexte pour la gestion des notifications
// Gère le stockage local, l'ajout de nouvelles notifications et le marquage comme lues
export function NotificationProvider({ children }: { children: ReactNode }) {
  // Charger les notifications depuis localStorage au démarrage
  // Utilise le localStorage pour persister les notifications entre les sessions
  const loadNotifications = (): Notification[] => {
    try {
      const stored = localStorage.getItem('admin_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // État des notifications chargées depuis le localStorage
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);

  // Sauvegarder automatiquement dans localStorage à chaque changement
  // Permet de persister les notifications même après rechargement de page
  useEffect(() => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fonction pour ajouter une nouvelle notification
  // Utilisée par différents composants pour créer des notifications (feedback, suppression compte, etc.)
  const addNotification = (notification: Notification) => {
    console.log('🔔 Nouvelle notification ajoutée:', notification);
    setNotifications(prev => [notification, ...prev]);
  };

  // Marquer une notification spécifique comme lue
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Effacer toutes les notifications
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

// Hook pour utiliser le contexte des notifications
// Doit être utilisé à l'intérieur d'un NotificationProvider
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
