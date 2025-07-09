
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faHistory,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  status: 'active' | 'inactive';
  lastModified: string;
}

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onHistory: (serviceId: string) => void;
}

export default function ServiceCard({ service, onEdit, onDelete, onHistory }: ServiceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(service.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onEdit({ ...service, title: editTitle.trim() });
      setIsEditing(false);
      toast({
        title: "Service modifié",
        description: `Le service "${editTitle}" a été mis à jour.`,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(service.title);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    onDelete(service.id);
    setShowDeleteConfirm(false);
    toast({
      title: "Service supprimé",
      description: `Le service "${service.title}" a été supprimé.`,
      variant: "destructive",
    });
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveEdit}>
                <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                {service.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Dernière modification: {service.lastModified}
        </div>
        
        {!isEditing && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
              <FontAwesomeIcon icon={faEdit} className="h-3 w-3 mr-1" />
              Modifier
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1"
            >
              <FontAwesomeIcon icon={faTrash} className="h-3 w-3 mr-1" />
              Supprimer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onHistory(service.id)}
              className="flex-1"
            >
              <FontAwesomeIcon icon={faHistory} className="h-3 w-3 mr-1" />
              Historique
            </Button>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300 mb-3">
              Êtes-vous sûr de vouloir supprimer ce service ?
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="destructive" onClick={handleConfirmDelete}>
                Confirmer
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
