import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClient } from '@/contexts/ClientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEuroSign, 
  faChartLine, 
  faBoxes, 
  faClock,
  faCamera,
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import ClientNotificationBell from '@/components/ClientNotificationBell';
import PredictionChart from '@/components/PredictionChart';
import TemporaryPasswordNotification from '@/components/TemporaryPasswordNotification';
import ChangePasswordForm from '@/components/ChangePasswordForm';

export default function ClientDashboard() {
  const { user, updateProfile } = useAuth();
  const { clientData, isLoading } = useClient();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  if (isLoading || !clientData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-6">
          {/* Logo/Icon */}
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-white" />
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-80 mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out animate-pulse"
                style={{
                  width: '100%',
                  animation: 'loading-progress 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chargement des données
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Préparation de votre tableau de bord...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Client
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tableau de bord • Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Bouton pour nettoyer les notifications client */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Nettoyer les notifications client dans le localStorage
              localStorage.removeItem('client_notifications');
              // Réinitialiser les notifications dans le state
              window.dispatchEvent(new CustomEvent('clearClientNotifications'));
            }}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            🗑️ Nettoyer notifications
          </Button>
          <ClientNotificationBell />
        </div>
      </div>

      {/* Notification pour mot de passe temporaire */}
      <TemporaryPasswordNotification 
        onChangePassword={() => setShowPasswordChange(true)}
      />

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Économies Totales
            </CardTitle>
            <FontAwesomeIcon icon={faEuroSign} className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clientData.metrics.totalSavings.toLocaleString('fr-FR')} €
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sur l'année écoulée
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Précision Globale
            </CardTitle>
            <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {clientData.metrics.avgImprovement}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              De précision moyenne
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Modèles Actifs
            </CardTitle>
            <FontAwesomeIcon icon={faBoxes} className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {clientData.metrics.activeModels}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              En fonctionnement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prédictions Totales
            </CardTitle>
            <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {clientData.metrics.uptime}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Prédictions effectuées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de Performance */}
      <PredictionChart />

      {/* Modal pour changer le mot de passe */}
      <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modification du mot de passe</DialogTitle>
          </DialogHeader>
          <ChangePasswordForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}