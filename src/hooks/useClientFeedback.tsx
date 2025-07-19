import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientFeedback {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'new' | 'read' | 'responded';
}

export function useClientFeedback(addNotification?: (notification: any) => void) {
  const [feedbacks, setFeedbacks] = useState<ClientFeedback[]>([]);
  const { user } = useAuth();

  const addFeedback = (data: {
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    if (!user || user.role !== 'client') return;

    const newFeedback: ClientFeedback = {
      id: Date.now().toString(),
      clientId: user.id,
      clientName: user.name,
      companyName: user.company || user.name, // Utiliser company si disponible
      subject: data.subject,
      message: data.message,
      priority: data.priority,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    setFeedbacks(prev => [newFeedback, ...prev]);

    // Créer une notification pour l'admin si la fonction est disponible
    if (addNotification) {
      addNotification({
        id: `feedback_${newFeedback.id}`,
        type: 'client_feedback',
        title: `Nouveau feedback: ${data.subject}`,
        description: `${data.message}\n\n--- Détails ---\nClient: ${user.name}\nPriorité: ${data.priority}`,
        timestamp: new Date().toISOString(),
        read: false,
        clientId: user.id,
        clientName: user.name
      });
    }

    return newFeedback;
  };

  const markAsRead = (id: string) => {
    setFeedbacks(prev => 
      prev.map(feedback => 
        feedback.id === id 
          ? { ...feedback, status: 'read' as const }
          : feedback
      )
    );
  };

  const markAsResponded = (id: string) => {
    setFeedbacks(prev => 
      prev.map(feedback => 
        feedback.id === id 
          ? { ...feedback, status: 'responded' as const }
          : feedback
      )
    );
  };

  return {
    feedbacks,
    addFeedback,
    markAsRead,
    markAsResponded
  };
}