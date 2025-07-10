
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, CompanyFormData } from '@/types/company';

interface CompanyContextType {
  companies: Company[];
  deletedCompanies: Company[];
  addCompany: (data: CompanyFormData) => void;
  updateCompany: (id: string, data: Partial<CompanyFormData>) => void;
  deleteCompany: (id: string) => void;
  restoreCompany: (id: string) => void;
  permanentlyDeleteCompany: (id: string) => void;
  getCompanyById: (id: string) => Company | undefined;
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
  const [deletedCompanies, setDeletedCompanies] = useState<Company[]>([]);

  // Initialiser avec des données de test
  useEffect(() => {
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'TechCorp Solutions',
        description: 'Entreprise technologique spécialisée dans les solutions IA',
        pack: 'deploiement',
        contact: { email: 'contact@techcorp.com', phone: '01 23 45 67 89' },
        access: { identifier: 'techcorp', password: 'TechCorp123!' },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        modelsCount: 3,
        activeModels: 2,
        lastActivity: '2 heures'
      },
      {
        id: '2',
        name: 'DataFlow Industries',
        description: 'Analyse et traitement de données industrielles',
        pack: 'prototype',
        contact: { email: 'info@dataflow.com', phone: '01 23 45 67 90' },
        access: { identifier: 'dataflow', password: 'DataFlow456!' },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        modelsCount: 5,
        activeModels: 5,
        lastActivity: '1 jour'
      }
    ];
    setCompanies(mockCompanies);
  }, []);

  const addCompany = (data: CompanyFormData) => {
    const newCompany: Company = {
      id: Date.now().toString(),
      ...data,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      modelsCount: 0,
      activeModels: 0,
      lastActivity: 'Jamais'
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, data: Partial<CompanyFormData>) => {
    setCompanies(prev => prev.map(company => 
      company.id === id 
        ? { ...company, ...data, updatedAt: new Date() }
        : company
    ));
  };

  const deleteCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    if (company) {
      const deletedCompany = {
        ...company,
        status: 'deleted' as const,
        deletedAt: new Date()
      };
      setDeletedCompanies(prev => [...prev, deletedCompany]);
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const restoreCompany = (id: string) => {
    const company = deletedCompanies.find(c => c.id === id);
    if (company) {
      const restoredCompany = {
        ...company,
        status: 'active' as const,
        deletedAt: undefined,
        updatedAt: new Date()
      };
      setCompanies(prev => [...prev, restoredCompany]);
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
      getCompanyById
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
