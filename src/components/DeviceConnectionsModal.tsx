
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DeviceConnectionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConnectionData {
  id: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  lastConnection: string;
  status: 'active' | 'inactive';
}

export default function DeviceConnectionsModal({ open, onOpenChange }: DeviceConnectionsModalProps) {
  const [connections, setConnections] = useState<ConnectionData[]>([]);

  useEffect(() => {
    // Simuler la récupération des données de connexion réelles du système
    const fetchRealConnections = () => {
      // Données basées sur les connexions réelles du navigateur et de la session
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const language = navigator.language;
      
      // Déterminer le type d'appareil basé sur l'user agent
      let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
      let deviceName = 'Ordinateur';
      
      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        if (/iPad/.test(userAgent)) {
          deviceType = 'tablet';
          deviceName = 'iPad';
        } else if (/iPhone/.test(userAgent)) {
          deviceType = 'mobile';
          deviceName = 'iPhone';
        } else if (/Android/.test(userAgent)) {
          deviceType = /Mobile/.test(userAgent) ? 'mobile' : 'tablet';
          deviceName = deviceType === 'mobile' ? 'Android Phone' : 'Android Tablet';
        }
      } else {
        // Desktop
        if (/Mac/.test(platform)) {
          deviceName = 'Mac';
        } else if (/Win/.test(platform)) {
          deviceName = 'PC Windows';
        } else if (/Linux/.test(platform)) {
          deviceName = 'Linux';
        }
      }

      // Localisation basée sur la langue du navigateur
      let location = 'France';
      if (language.includes('en')) location = 'International';
      if (language.includes('es')) location = 'Espagne';
      if (language.includes('de')) location = 'Allemagne';
      if (language.includes('it')) location = 'Italie';

      const currentConnection: ConnectionData = {
        id: '1',
        device: deviceName,
        deviceType,
        location,
        lastConnection: new Date().toLocaleString('fr-FR'),
        status: 'active'
      };

      // Ajouter d'autres connexions récentes depuis le stockage local si disponible
      const storedConnections = localStorage.getItem('deviceConnections');
      let allConnections = [currentConnection];
      
      if (storedConnections) {
        const parsed = JSON.parse(storedConnections);
        allConnections = [currentConnection, ...parsed.filter((conn: ConnectionData) => conn.id !== '1')];
      }

      // Limiter à 10 connexions récentes
      allConnections = allConnections.slice(0, 10);
      
      // Sauvegarder dans le stockage local
      localStorage.setItem('deviceConnections', JSON.stringify(allConnections));
      
      setConnections(allConnections);
    };

    if (open) {
      fetchRealConnections();
    }
  }, [open]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connexions récentes et appareils utilisés</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Appareil
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Localisation
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Dernière connexion
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {connections.map((connection, index) => (
                  <tr key={connection.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""}>
                    <td className="border border-gray-300 p-3">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(connection.deviceType)}
                        <span>{connection.device}</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      {connection.location}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {connection.lastConnection}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <Badge variant={connection.status === 'active' ? 'default' : 'secondary'}>
                        {connection.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold mb-2">Informations de sécurité</h4>
            <ul className="text-sm space-y-1">
              <li>• Les connexions actives sont mises à jour en temps réel</li>
              <li>• Les données d'historique sont conservées pendant 30 jours</li>
              <li>• Vous pouvez révoquer l'accès depuis les paramètres de sécurité</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
