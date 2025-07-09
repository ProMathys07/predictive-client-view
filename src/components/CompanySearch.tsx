
import React from 'react';
import { Input } from '@/components/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface CompanySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function CompanySearch({ searchTerm, onSearchChange }: CompanySearchProps) {
  return (
    <div className="relative max-w-md">
      <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Rechercher une entreprise..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
