
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
  };
  identifier: string;
  gcpId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastActivity: string;
  modelsCount: number;
  activeModels: number;
  models?: any[];
}

export interface DeletedCompany extends Company {
  deletedAt: string;
}
