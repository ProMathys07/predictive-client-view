import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faRefresh, faSpinner, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import type { User } from '@/contexts/AuthContext';

export default function UserManagementTable() {
  const { getAllUsers, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsers();
    }
  }, [user]);

  const getStatusBadge = (status: string = 'actif') => {
    const variants: Record<string, { variant: any; label: string }> = {
      'actif': { variant: 'default', label: 'Actif' },
      'en_attente_suppression': { variant: 'secondary', label: 'En attente suppression' },
      'supprimé': { variant: 'destructive', label: 'Supprimé' },
      'restauré': { variant: 'outline', label: 'Restauré' }
    };
    
    const config = variants[status] || variants['actif'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge variant="default" className="bg-blue-600">
        <FontAwesomeIcon icon={faUserTie} className="mr-1 h-3 w-3" />
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary">
        <FontAwesomeIcon icon={faUser} className="mr-1 h-3 w-3" />
        Client
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
          Gestion des Utilisateurs ({users.length})
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadUsers}
          disabled={loading}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" />
          ) : (
            <FontAwesomeIcon icon={faRefresh} className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FontAwesomeIcon icon={faSpinner} spin className="h-6 w-6 mr-2" />
            <span>Chargement des utilisateurs...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Mot de passe</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Mis à jour le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell className="font-medium">{userData.name}</TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>{getRoleBadge(userData.role)}</TableCell>
                    <TableCell>{userData.company}</TableCell>
                    <TableCell>{getStatusBadge(userData.status)}</TableCell>
                    <TableCell>
                      {userData.isTemporaryPassword ? (
                        <Badge variant="destructive">Temporaire</Badge>
                      ) : (
                        <Badge variant="default">Définitif</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(userData.created_at)}</TableCell>
                    <TableCell>{formatDate(userData.updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}