
export interface Company {
  id: string;
  name: string;
  description: string;
  pack: 'diagnostic' | 'prototype' | 'deploiement' | 'abonnement';
  logo?: string;
  logoFile?: File; // For uploaded images
  contact: {
    email: string;
    phone: string;
    address?: string;
  };
  access: {
    identifier: string;
    configurationLink: string;
    gcpId: string; // New GCP ID field
  };
  status: 'active' | 'inactive' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  modelsCount: number;
  activeModels: number;
  lastActivity: string;
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
  diagnostic: {
    name: 'Diagnostic',
    price: '590€',
    duration: '5 jours',
    commitment: 'Sans engagement'
  },
  prototype: {
    name: 'Prototype',
    price: '2 900€',
    duration: '10 jours',
    commitment: 'Sans engagement'
  },
  deploiement: {
    name: 'Déploiement',
    price: '3 700€',
    duration: '10 jours',
    commitment: 'Sans engagement'
  },
  abonnement: {
    name: 'Suivi & Maintenance',
    price: '490€/Mois',
    duration: 'Continu',
    commitment: 'Sans engagement'
  }
} as const;
