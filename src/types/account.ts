// Types pour la gestion des comptes et suppressions

export type AccountStatus = 'actif' | 'en_attente_suppression' | 'supprimé' | 'restauré';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  profileImage?: string;
  company: string;
  companyLogo?: string;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface AccountDeletionRequest {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin_response?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountDeletionNotification {
  id: string;
  type: 'deletion_request_approved' | 'deletion_request_rejected';
  title: string;
  message: string;
  client_id: string;
  read: boolean;
  created_at: string;
}