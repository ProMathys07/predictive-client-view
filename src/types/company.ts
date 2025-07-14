
export interface Company {
  id: string;
  name: string;
  description: string;
  pack: 'diagnostic' | 'prototype' | 'deployment' | 'subscription';
  logo?: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  access: {
    identifier: string;
    configurationLink: string;
    gcpId: string;
  };
  status: 'active' | 'inactive' | 'deleted';
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  modelsCount: number;
  activeModels: number;
  models?: any[];
}

export interface DeletedCompany extends Company {
  deletedAt: string;
}

export interface CompanyFormData {
  name: string;
  description: string;
  pack: Company['pack'];
  logo?: string;
  logoFile?: File;
  contact: {
    email: string;
    phone: string;
    address?: string;
  };
  access: {
    identifier: string;
    configurationLink: string;
    gcpId: string;
  };
}

export const PACKS = {
  diagnostic: { name: 'Diagnostic', color: 'blue' },
  prototype: { name: 'Prototype', color: 'yellow' },
  deployment: { name: 'Déploiement', color: 'green' },
  subscription: { name: 'Abonnement', color: 'purple' }
} as const;
