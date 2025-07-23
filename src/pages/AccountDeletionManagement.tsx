import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import AccountDeletionManager from '@/components/AccountDeletionManager';

// Page de gestion des suppressions de compte pour les administrateurs
export default function AccountDeletionManagement() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des suppressions</h1>
        <p className="text-muted-foreground">
          Gérez les demandes de suppression de compte et la corbeille des comptes supprimés.
        </p>
      </div>

      {/* Avertissement de sécurité */}
      <Card className="border-warning">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <CardTitle className="text-warning">Avertissement de sécurité</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            La suppression définitive d'un compte est <strong>irréversible</strong>. 
            Assurez-vous de bien comprendre les implications avant de confirmer une suppression.
            Les comptes peuvent être restaurés tant qu'ils ne sont pas supprimés définitivement.
          </CardDescription>
        </CardContent>
      </Card>

      {/* Composant principal de gestion */}
      <AccountDeletionManager />
    </div>
  );
}