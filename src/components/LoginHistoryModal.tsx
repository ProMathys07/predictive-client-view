
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHistory,
  faCheckCircle,
  faTimesCircle,
  faDesktop,
  faMobile,
  faTablet
} from '@fortawesome/free-solid-svg-icons';

interface LoginHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginEntry {
  id: string;
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  success: boolean;
  userAgent: string;
}

export default function LoginHistoryModal({ isOpen, onClose }: LoginHistoryModalProps) {
  // Données simulées pour l'historique de connexion
  const [loginHistory] = useState<LoginEntry[]>([
    {
      id: '1',
      timestamp: '2025-01-09 14:30:00',
      ip: '192.168.1.100',
      location: 'Paris, France',
      device: 'Desktop',
      success: true,
      userAgent: 'Chrome 120.0.0'
    },
    {
      id: '2',
      timestamp: '2025-01-09 08:15:00',
      ip: '192.168.1.100',
      location: 'Paris, France',
      device: 'Mobile',
      success: true,
      userAgent: 'Safari Mobile 17.0'
    },
    {
      id: '3',
      timestamp: '2025-01-08 16:45:00',
      ip: '10.0.0.50',
      location: 'Lyon, France',
      device: 'Desktop',
      success: false,
      userAgent: 'Firefox 121.0'
    },
    {
      id: '4',
      timestamp: '2025-01-08 09:30:00',
      ip: '192.168.1.100',
      location: 'Paris, France',
      device: 'Desktop',
      success: true,
      userAgent: 'Chrome 120.0.0'
    },
    {
      id: '5',
      timestamp: '2025-01-07 14:20:00',
      ip: '192.168.1.100',
      location: 'Paris, France',
      device: 'Tablet',
      success: true,
      userAgent: 'Safari 17.0'
    }
  ]);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <FontAwesomeIcon icon={faMobile} className="h-4 w-4" />;
      case 'tablet':
        return <FontAwesomeIcon icon={faTablet} className="h-4 w-4" />;
      default:
        return <FontAwesomeIcon icon={faDesktop} className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-green-600" />
    ) : (
      <FontAwesomeIcon icon={faTimesCircle} className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Succès</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Échec</Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="h-5 w-5" />
            Historique des connexions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 dark:text-green-100">Connexions réussies</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {loginHistory.filter(entry => entry.success).length}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-red-900 dark:text-red-100">Tentatives échouées</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {loginHistory.filter(entry => !entry.success).length}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Total</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {loginHistory.length}
              </p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date & Heure</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-left font-medium">Appareil</th>
                  <th className="px-4 py-3 text-left font-medium">Localisation</th>
                  <th className="px-4 py-3 text-left font-medium">IP</th>
                  <th className="px-4 py-3 text-left font-medium">Navigateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loginHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 font-medium">
                      {new Date(entry.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.success)}
                        {getStatusBadge(entry.success)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(entry.device)}
                        <span>{entry.device}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{entry.location}</td>
                    <td className="px-4 py-3 font-mono text-sm">{entry.ip}</td>
                    <td className="px-4 py-3 text-sm">{entry.userAgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
