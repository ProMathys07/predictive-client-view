
import { Calendar, Play, Pause, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ModelCardProps {
  model: {
    id: string;
    name: string;
    version: string;
    isActive: boolean;
    createdAt: string;
    lastPrediction: string;
    accuracy: number;
  };
  onToggleActive: (modelId: string) => void;
  onDelete: (modelId: string) => void;
}

export default function ModelCard({ model, onToggleActive, onDelete }: ModelCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{model.name}</CardTitle>
          <Badge variant={model.isActive ? 'default' : 'secondary'}>
            {model.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">Version {model.version}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Créé le: {model.createdAt}
          </div>
          
          <div className="text-sm text-gray-600">
            Dernière prédiction: {model.lastPrediction}
          </div>
          
          <div className="text-sm">
            <span className="text-gray-600">Précision: </span>
            <span className="font-semibold text-green-600">{model.accuracy}%</span>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              variant={model.isActive ? "outline" : "default"}
              onClick={() => onToggleActive(model.id)}
              className="flex items-center"
            >
              {model.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Désactiver
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Activer
                </>
              )}
            </Button>
            
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-1" />
              Recharger
            </Button>
            
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onDelete(model.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
