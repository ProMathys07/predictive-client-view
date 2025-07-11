
import React from 'react';
import { Company } from '@/types/company';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyCard from './CompanyCard';

interface CompanyTabsProps {
  companies: Company[];
  deletedCompanies: Company[];
  filteredCompanies: Company[];
  filteredDeletedCompanies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
  onRestoreCompany: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onCompanyClick?: (company: Company) => void;
}

export default function CompanyTabs({
  companies,
  deletedCompanies,
  filteredCompanies,
  filteredDeletedCompanies,
  onEditCompany,
  onDeleteCompany,
  onRestoreCompany,
  onPermanentDelete,
  onCompanyClick
}: CompanyTabsProps) {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">
          Entreprises ({companies.length})
        </TabsTrigger>
        <TabsTrigger value="deleted">
          Corbeille ({deletedCompanies.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={onEditCompany}
              onDelete={onDeleteCompany}
              onRestore={onRestoreCompany}
              onPermanentDelete={onPermanentDelete}
              onCompanyClick={onCompanyClick}
            />
          ))}
        </div>
        {filteredCompanies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune entreprise trouvée
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="deleted" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeletedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              isDeleted={true}
              onEdit={onEditCompany}
              onDelete={onDeleteCompany}
              onRestore={onRestoreCompany}
              onPermanentDelete={onPermanentDelete}
            />
          ))}
        </div>
        {filteredDeletedCompanies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune entreprise dans la corbeille
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
