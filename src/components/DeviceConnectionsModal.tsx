
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet, Globe } from 'lucide-react';

interface DeviceConnectionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConnectionData {
  id: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  lastConnection: string;
  ipAddress: string;
  status: 'active' | 'inactive';
}

const mockConnections: ConnectionData[] = [
  {
    id: '1',
    device: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Chrome 120.0',
    location: 'Paris, France',
    lastConnection: '2025-01-14 09:30',
    ipAddress: '192.168.1.25',
    status: 'active'
  },
  {
    id: '2',
    device: 'iPhone 15',
    deviceType: 'mobile',
    browser: 'Safari 17.2',
    location: 'Lyon, France',
    lastConnection: '2025-01-13 18:45',
    ipAddress: '10.0.0.15',
    status: 'inactive'
  },
  {
    id: '3',
    device: 'Windows PC',
    deviceType: 'desktop',
    browser: 'Firefox 121.0',
    location: 'Marseille, France',
    lastConnection: '2025-01-12 14:20',
    ipAddress: '172.16.0.8',
    status: 'inactive'
  },
  {
    id: '4',
    device: 'iPad Air',
    deviceType: 'tablet',
    browser: 'Safari 17.1',
    location: 'Toulouse, France',
    lastConnection: '2025-01-10 11:15',
    ipAddress: '192.168.0.45',
    status: 'inactive'
  }
];

export default function DeviceConnectionsModal({ open, onOpenChange }: DeviceConnectionsModalProps) {
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
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
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
                    Navigateur
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Localisation
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Dernière connexion
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Adresse IP
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-medium">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockConnections.map((connection, index) => (
                  <tr key={connection.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""}>
                    <td className="border border-gray-300 p-3">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(connection.deviceType)}
                        <span>{connection.device}</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3">
                      {connection.browser}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {connection.location}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {connection.lastConnection}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {connection.ipAddress}
                      </code>
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
