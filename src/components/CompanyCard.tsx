
import React from 'react';
import { Company, PACKS } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faUndo, 
  faTrashAlt,
  faBuilding,
  faEnvelope,
  faPhone,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

interface CompanyCardProps {
  company: Company;
  isDeleted?: boolean;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onCompanyClick?: (company: Company) => void;
}

const getStatusBadge = (status: Company['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    case 'inactive':
      return <Badge className="bg-yellow-100 text-yellow-800">Inactif</Badge>;
    case 'deleted':
      return <Badge className="bg-red-100 text-red-800">Supprimé</Badge>;
    default:
      return null;
  }
};

export default function CompanyCard({ 
  company, 
  isDeleted = false, 
  onEdit, 
  onDelete, 
  onRestore, 
  onPermanentDelete,
  onCompanyClick 
}: CompanyCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Empêcher la propagation du clic si on clique sur les boutons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Appeler la fonction de clic uniquement pour les entreprises actives
    if (!isDeleted && onCompanyClick) {
      onCompanyClick(company);
    }
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${!isDeleted ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 mr-2 text-blue-600" />
            {company.name}
          </CardTitle>
          {getStatusBadge(company.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">{PACKS[company.pack].name}</Badge>
            <span className="text-gray-500">
              {company.activeModels}/{company.modelsCount} modèles actifs
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />
              {company.contact.email}
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="h-3 w-3" />
              {company.contact.phone}
            </div>
            {company.contact.address && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />
                {company.contact.address}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {!isDeleted ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(company);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(company.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3 w-3 mr-1" />
                  Supprimer
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(company.id);
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  <FontAwesomeIcon icon={faUndo} className="h-3 w-3 mr-1" />
                  Restaurer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPermanentDelete(company.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="h-3 w-3 mr-1" />
                  Supprimer définitivement
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
