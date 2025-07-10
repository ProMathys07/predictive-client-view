
import React, { useState } from 'react';
import { useCompanies } from '@/contexts/CompanyContext';
import { Company } from '@/types/company';
import CompanyForm from '@/components/CompanyForm';
import CompanyHeader from '@/components/CompanyHeader';
import CompanySearch from '@/components/CompanySearch';
import CompanyTabs from '@/components/CompanyTabs';

export default function Companies() {
  const { companies, deletedCompanies, addCompany, updateCompany, deleteCompany, restoreCompany, permanentlyDeleteCompany } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeletedCompanies = deletedCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = (data: any) => {
    addCompany(data);
    setShowForm(false);
  };

  const handleEditCompany = (data: any) => {
    if (editingCompany) {
      updateCompany(editingCompany.id, data);
      setEditingCompany(null);
    }
  };

  const handleDeleteCompany = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ? Elle sera placée dans la corbeille.')) {
      deleteCompany(id);
    }
  };

  const handleRestoreCompany = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir restaurer cette entreprise ?')) {
      restoreCompany(id);
    }
  };

  const handlePermanentDelete = (id: string) => {
    if (confirm('ATTENTION : Cette action est irréversible ! Êtes-vous sûr de vouloir supprimer définitivement cette entreprise ?')) {
      permanentlyDeleteCompany(id);
    }
  };

  const handleCompanyClick = (company: Company) => {
    console.log('Entreprise cliquée:', company);
    // TODO: Naviguer vers la page de détail de l'entreprise
    // Pour l'instant, on log juste l'entreprise cliquée
  };

  if (showForm) {
    return (
      <div className="p-6">
        <CompanyForm
          onSubmit={handleAddCompany}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (editingCompany) {
    return (
      <div className="p-6">
        <CompanyForm
          company={editingCompany}
          onSubmit={handleEditCompany}
          onCancel={() => setEditingCompany(null)}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <CompanyHeader onAddCompany={() => setShowForm(true)} />
      
      <CompanySearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <CompanyTabs
        companies={companies}
        deletedCompanies={deletedCompanies}
        filteredCompanies={filteredCompanies}
        filteredDeletedCompanies={filteredDeletedCompanies}
        onEditCompany={setEditingCompany}
        onDeleteCompany={handleDeleteCompany}
        onRestoreCompany={handleRestoreCompany}
        onPermanentDelete={handlePermanentDelete}
        onCompanyClick={handleCompanyClick}
      />
    </div>
  );
}
