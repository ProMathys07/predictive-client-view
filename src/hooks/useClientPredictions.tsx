import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientPrediction {
  id: string;
  clientId: string;
  clientName: string;
  fileName: string;
  dataSize: string;
  modelType: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  results?: {
    accuracy: number;
    confidence: number;
    predictions: Array<{
      input: string;
      output: string;
      probability: number;
    }>;
  };
  createdAt: string;
  completedAt?: string;
}

export function useClientPredictions(addNotification?: (notification: any) => void) {
  const [predictions, setPredictions] = useState<ClientPrediction[]>([]);
  const { user } = useAuth();

  const createPrediction = (data: {
    fileName: string;
    dataSize: string;
    modelType: string;
  }) => {
    if (!user || user.role !== 'client') return;

    const newPrediction: ClientPrediction = {
      id: Date.now().toString(),
      clientId: user.id,
      clientName: user.name,
      fileName: data.fileName,
      dataSize: data.dataSize,
      modelType: data.modelType,
      status: 'uploading',
      createdAt: new Date().toISOString()
    };

    setPredictions(prev => [newPrediction, ...prev]);

    // Simuler le processus de prédiction
    setTimeout(() => {
      setPredictions(prev => 
        prev.map(p => 
          p.id === newPrediction.id 
            ? { ...p, status: 'processing' as const }
            : p
        )
      );
    }, 1000);

    setTimeout(() => {
      const results = {
        accuracy: 85 + Math.random() * 10,
        confidence: 78 + Math.random() * 15,
        predictions: [
          { input: 'Données Q1', output: 'Croissance +12%', probability: 0.89 },
          { input: 'Données Q2', output: 'Stabilité', probability: 0.76 },
          { input: 'Données Q3', output: 'Déclin -3%', probability: 0.82 }
        ]
      };

      setPredictions(prev => 
        prev.map(p => 
          p.id === newPrediction.id 
            ? { 
                ...p, 
                status: 'completed' as const,
                results,
                completedAt: new Date().toISOString()
              }
            : p
        )
      );

      // Notifier l'admin si la fonction est disponible
      if (addNotification) {
        addNotification({
          id: `prediction_${newPrediction.id}`,
          type: 'client_prediction',
          title: 'Prédiction terminée',
          description: `${user.name} a terminé une prédiction (${data.modelType})`,
          timestamp: new Date().toISOString(),
          read: false,
          clientId: user.id,
          clientName: user.name
        });
      }
    }, 5000);

    // Notifier l'admin du début de prédiction si la fonction est disponible
    if (addNotification) {
      addNotification({
        id: `prediction_start_${newPrediction.id}`,
        type: 'client_data_upload',
        title: 'Nouvelle prédiction démarrée',
        description: `${user.name} a chargé des données pour prédiction`,
        timestamp: new Date().toISOString(),
        read: false,
        clientId: user.id,
        clientName: user.name
      });
    }

    return newPrediction;
  };

  return {
    predictions,
    createPrediction
  };
}