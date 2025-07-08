
import { Building2, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    lastActivity: string;
    modelsCount: number;
    activeModels: number;
    status: 'active' | 'inactive' | 'warning';
  };
  onViewDetails: (clientId: string) => void;
}

export default function ClientCard({ client, onViewDetails }: ClientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            {client.name}
          </CardTitle>
          <div className={`w-3 h-3 rounded-full ${getStatusColor(client.status)}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Dernière activité: {client.lastActivity}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Activity className="h-4 w-4 mr-2" />
            {client.activeModels}/{client.modelsCount} modèles actifs
          </div>

          <div className="flex justify-between items-center pt-2">
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status === 'active' ? 'Actif' : 'Inactif'}
            </Badge>
            <Button 
              size="sm" 
              onClick={() => onViewDetails(client.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Voir détails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
