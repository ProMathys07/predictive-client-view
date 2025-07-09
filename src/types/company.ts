
export interface Company {
  id: string;
  name: string;
  description: string;
  pack: 'diagnostic' | 'prototype-mensuel' | 'prototype' | 'deploiement';
  logo?: string;
  contact: {
    email: string;
    phone: string;
    address?: string;
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
  contact: {
    email: string;
    phone: string;
    address?: string;
  };
}

export const PACKS = {
  diagnostic: {
    name: 'Diagnostic',
    price: '850€',
    duration: '5 jours',
    commitment: 'Sans engagement'
  },
  'prototype-mensuel': {
    name: 'Prototype Mensuel',
    price: '490€/Mois',
    duration: '1-2 semaines',
    commitment: 'Engagement 6 mois'
  },
  prototype: {
    name: 'Prototype',
    price: '2 900€',
    duration: '1-2 semaines',
    commitment: 'Sans engagement'
  },
  deploiement: {
    name: 'Déploiement',
    price: '7 500€',
    duration: '3-5 semaines',
    commitment: 'Sans engagement'
  }
} as const;
