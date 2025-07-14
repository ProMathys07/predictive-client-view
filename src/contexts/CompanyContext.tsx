import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, CompanyFormData, DeletedCompany } from '@/types/company';

interface CompanyContextType {
  companies: Company[];
  deletedCompanies: DeletedCompany[];
  addCompany: (data: CompanyFormData) => void;
  updateCompany: (id: string, data: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  restoreCompany: (id: string) => void;
  permanentlyDeleteCompany: (id: string) => void;
  getCompanyById: (id: string) => Company | undefined;
  updateActiveModels: (companyId: string, activeCount: number) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompanies = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanies must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deletedCompanies, setDeletedCompanies] = useState<DeletedCompany[]>([]);

  // Initialiser avec des données de test
  useEffect(() => {
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        description: 'Entreprise technologique spécialisée dans les solutions IA',
        pack: 'deployment',
        contact: { 
          name: 'Jean Dupont',
          email: 'contact@techcorp.com', 
          phone: '01 23 45 67 89' 
        },
        access: { 
          identifier: 'techcorp', 
          configurationLink: 'https://config.aidatapme.com/techcorp@client',
          gcpId: 'techcorp-ai-project-2024'
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modelsCount: 0,
        activeModels: 0,
        lastActivity: 'Aucune activité'
      },
      {
        id: '2',
        name: 'DataFlow Industries',
        description: 'Analyse et traitement de données industrielles',
        pack: 'prototype',
        contact: { 
          name: 'Marie Martin',
          email: 'info@dataflow.com', 
          phone: '01 23 45 67 90' 
        },
        access: { 
          identifier: 'dataflow', 
          configurationLink: 'https://config.aidatapme.com/dataflow@client',
          gcpId: 'dataflow-analytics-2024'
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modelsCount: 0,
        activeModels: 0,
        lastActivity: 'Aucune activité'
      }
    ];
    setCompanies(mockCompanies);
  }, []);

  const addCompany = (data: CompanyFormData) => {
    const newCompany: Company = {
      id: Date.now().toString(),
      ...data,
      contact: {
        name: data.contact.email.split('@')[0], // Générer un nom par défaut
        ...data.contact
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelsCount: 0,
      activeModels: 0,
      lastActivity: 'Aucune activité',
      models: []
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, data: Partial<Company>) => {
    setCompanies(prev => prev.map(company => 
      company.id === id 
        ? { ...company, ...data, updatedAt: new Date().toISOString() }
        : company
    ));
  };

  const updateActiveModels = (companyId: string, activeCount: number) => {
    setCompanies(prev => prev.map(company => 
      company.id === companyId 
        ? { ...company, activeModels: activeCount, updatedAt: new Date().toISOString() }
        : company
    ));
  };

  const deleteCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    if (company) {
      const deletedCompany: DeletedCompany = {
        ...company,
        status: 'deleted',
        deletedAt: new Date().toISOString()
      };
      setDeletedCompanies(prev => [...prev, deletedCompany]);
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const restoreCompany = (id: string) => {
    const company = deletedCompanies.find(c => c.id === id);
    if (company) {
      const { deletedAt, ...restoredCompany } = company;
      const finalCompany: Company = {
        ...restoredCompany,
        status: 'active',
        updatedAt: new Date().toISOString()
      };
      setCompanies(prev => [...prev, finalCompany]);
      setDeletedCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const permanentlyDeleteCompany = (id: string) => {
    setDeletedCompanies(prev => prev.filter(c => c.id !== id));
  };

  const getCompanyById = (id: string) => {
    return companies.find(c => c.id === id) || deletedCompanies.find(c => c.id === id);
  };

  return (
    <CompanyContext.Provider value={{
      companies,
      deletedCompanies,
      addCompany,
      updateCompany,
      deleteCompany,
      restoreCompany,
      permanentlyDeleteCompany,
      getCompanyById,
      updateActiveModels
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
