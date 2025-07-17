import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useClientPredictions, ClientPrediction } from '@/hooks/useClientPredictions';
import { useClientFeedback, ClientFeedback } from '@/hooks/useClientFeedback';
import { useNotifications } from '@/hooks/useNotifications';

// Données spécifiques au client connecté
interface ClientData {
  company: string;
  savings: Array<{
    category: string;
    annualSaving: number;
    improvement: number;
    description: string;
  }>;
  metrics: {
    totalSavings: number;
    avgImprovement: number;
    activeModels: number;
    uptime: number;
  };
  predictions: Array<{
    id: string;
    category: string;
    prediction: string;
    confidence: number;
    impact: 'positive' | 'negative' | 'neutral';
    value: string;
    createdAt: string;
  }>;
  recentPredictions?: Array<{
    date: string;
    modelType: string;
    result: string;
    confidence: number;
    validation: 'En attente' | 'Validé' | 'Rejeté';
  }>;
}

interface ClientContextType {
  clientData: ClientData | null;
  isLoading: boolean;
  refreshData: () => void;
  // Ajout des fonctionnalités client avec notifications admin
  predictions: ClientPrediction[];
  createPrediction: (data: { fileName: string; dataSize: string; modelType: string; }) => ClientPrediction | undefined;
  feedbacks: ClientFeedback[];
  addFeedback: (data: { subject: string; message: string; priority: 'low' | 'medium' | 'high'; }) => ClientFeedback | undefined;
}

const ClientContext = createContext<ClientContextType>({
  clientData: null,
  isLoading: true,
  refreshData: () => {},
  predictions: [],
  createPrediction: () => undefined,
  feedbacks: [],
  addFeedback: () => undefined
});

export const useClient = () => useContext(ClientContext);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtenir la fonction addNotification - cela peut échouer si le provider n'est pas disponible
  const { addNotification } = useNotifications();

  // Intégration des hooks client avec notifications admin
  const { predictions, createPrediction } = useClientPredictions(addNotification);
  const { feedbacks, addFeedback } = useClientFeedback(addNotification);

  // Données mockées spécifiques par client
  const getClientData = (companyName: string): ClientData => {
    const mockData: Record<string, ClientData> = {
      'TechnoSolutions': {
        company: 'TechnoSolutions',
        savings: [
          {
            category: 'Gestion des stocks',
            annualSaving: 15000,
            improvement: 25,
            description: 'Réduction des surstocks et ruptures'
          },
          {
            category: 'Optimisation logistique',
            annualSaving: 8500,
            improvement: 18,
            description: 'Amélioration des circuits de livraison'
          },
          {
            category: 'Maintenance prédictive',
            annualSaving: 12000,
            improvement: 30,
            description: 'Réduction des pannes imprévues'
          },
          {
            category: 'Gestion énergétique',
            annualSaving: 5200,
            improvement: 15,
            description: 'Optimisation de la consommation'
          }
        ],
        metrics: {
          totalSavings: 40700,
          avgImprovement: 22,
          activeModels: 4,
          uptime: 1247
        },
        predictions: [],
        recentPredictions: [
          {
            date: '2024-01-15T14:30:00Z',
            modelType: 'Optimisation des stocks',
            result: 'Réduction stock de 15%',
            confidence: 87,
            validation: 'Validé'
          },
          {
            date: '2024-01-15T11:20:00Z',
            modelType: 'Prévision des ventes',
            result: 'Hausse attendue 12%',
            confidence: 82,
            validation: 'En attente'
          },
          {
            date: '2024-01-14T16:45:00Z',
            modelType: 'Maintenance prédictive',
            result: 'Maintenance préventive requise',
            confidence: 94,
            validation: 'Validé'
          },
          {
            date: '2024-01-14T09:15:00Z',
            modelType: 'Optimisation énergétique',
            result: 'Économie possible 8%',
            confidence: 78,
            validation: 'En attente'
          }
        ]
      },
      'InnovaCorp': {
        company: 'InnovaCorp',
        savings: [
          {
            category: 'Gestion des stocks',
            annualSaving: 22000,
            improvement: 28,
            description: 'Optimisation des niveaux de stock'
          },
          {
            category: 'Production automatisée',
            annualSaving: 18000,
            improvement: 35,
            description: 'Amélioration des cadences'
          }
        ],
        metrics: {
          totalSavings: 40000,
          avgImprovement: 31,
          activeModels: 3,
          uptime: 892
        },
        predictions: [],
        recentPredictions: [
          {
            date: '2024-01-15T10:15:00Z',
            modelType: 'Production automatisée',
            result: 'Augmentation rendement 20%',
            confidence: 91,
            validation: 'Validé'
          },
          {
            date: '2024-01-14T15:30:00Z',
            modelType: 'Gestion des stocks',
            result: 'Optimisation flux 18%',
            confidence: 85,
            validation: 'En attente'
          }
        ]
      }
    };

    return mockData[companyName] || mockData['TechnoSolutions'];
  };

  const refreshData = () => {
    if (!user || user.role !== 'client') return;
    
    setIsLoading(true);
    // Simulation d'un chargement
    setTimeout(() => {
      const data = getClientData(user.company);
      setClientData(data);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (user && user.role === 'client') {
      refreshData();
    } else {
      setClientData(null);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <ClientContext.Provider value={{ 
      clientData, 
      isLoading, 
      refreshData,
      predictions,
      createPrediction,
      feedbacks,
      addFeedback 
    }}>
      {children}
    </ClientContext.Provider>
  );
};