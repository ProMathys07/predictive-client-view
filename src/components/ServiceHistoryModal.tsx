
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHistory,
  faEdit,
  faTrash,
  faPlus,
  faFileInvoice,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

interface ServiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

interface HistoryEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  type: 'creation' | 'modification' | 'deletion' | 'billing' | 'reminder';
}

export default function ServiceHistoryModal({ isOpen, onClose, serviceId }: ServiceHistoryModalProps) {
  // Données simulées pour l'historique
  const [history] = useState<HistoryEntry[]>([
    {
      id: '1',
      action: 'Rappel envoyé',
      description: 'Rappel de paiement envoyé pour la facture INV-002',
      timestamp: '2025-01-09 14:30:00',
      user: 'Admin',
      type: 'reminder'
    },
    {
      id: '2',
      action: 'Service modifié',
      description: 'Nom du service changé de "Diagnostic v1" à "Diagnostic"',
      timestamp: '2025-01-08 10:15:00',
      user: 'Admin',
      type: 'modification'
    },
    {
      id: '3',
      action: 'Facture générée',
      description: 'Facture INV-002 créée (490€)',
      timestamp: '2025-01-07 16:45:00',
      user: 'System',
      type: 'billing'
    },
    {
      id: '4',
      action: 'Service créé',
      description: 'Création du service Diagnostic',
      timestamp: '2025-01-01 09:00:00',
      user: 'Admin',
      type: 'creation'
    }
  ]);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'creation':
        return <FontAwesomeIcon icon={faPlus} className="h-4 w-4 text-green-600" />;
      case 'modification':
        return <FontAwesomeIcon icon={faEdit} className="h-4 w-4 text-blue-600" />;
      case 'deletion':
        return <FontAwesomeIcon icon={faTrash} className="h-4 w-4 text-red-600" />;
      case 'billing':
        return <FontAwesomeIcon icon={faFileInvoice} className="h-4 w-4 text-purple-600" />;
      case 'reminder':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-orange-600" />;
      default:
        return <FontAwesomeIcon icon={faHistory} className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'creation':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Création</Badge>;
      case 'modification':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Modification</Badge>;
      case 'deletion':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Suppression</Badge>;
      case 'billing':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Facturation</Badge>;
      case 'reminder':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Rappel</Badge>;
      default:
        return <Badge>Action</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="h-5 w-5" />
            Historique du service {serviceId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucun historique disponible pour ce service.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(entry.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {entry.action}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {entry.description}
                        </p>
                      </div>
                      {getActionBadge(entry.type)}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(entry.timestamp).toLocaleString('fr-FR')}</span>
                      <span>•</span>
                      <span>Par {entry.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
