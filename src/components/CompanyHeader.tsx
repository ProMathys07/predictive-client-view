
import React from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface CompanyHeaderProps {
  onAddCompany: () => void;
}

export default function CompanyHeader({ onAddCompany }: CompanyHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des Entreprises
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gérez vos clients et leurs informations
        </p>
      </div>
      <Button onClick={onAddCompany}>
        <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
        Ajouter une entreprise
      </Button>
    </div>
  );
}
