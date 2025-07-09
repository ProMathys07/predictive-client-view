
import React, { useState } from 'react';
import { useCompanies } from '@/contexts/CompanyContext';
import { Company, PACKS } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyForm from '@/components/CompanyForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faRestore, 
  faTrashAlt,
  faSearch,
  faBuilding,
  faEnvelope,
  faPhone,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

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

  const getStatusBadge = (status: Company['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Inactif</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800">Supprimé</Badge>;
      default:
        return null;
    }
  };

  const CompanyCard = ({ company, isDeleted = false }: { company: Company; isDeleted?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 mr-2 text-blue-600" />
            {company.name}
          </CardTitle>
          {getStatusBadge(company.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">{PACKS[company.pack].name}</Badge>
            <span className="text-gray-500">
              {company.activeModels}/{company.modelsCount} modèles actifs
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="h-3 w-3" />
              {company.contact.email}
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="h-3 w-3" />
              {company.contact.phone}
            </div>
            {company.contact.address && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />
                {company.contact.address}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {!isDeleted ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingCompany(company)}
                >
                  <FontAwesomeIcon icon={faEdit} className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteCompany(company.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-3 w-3 mr-1" />
                  Supprimer
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRestoreCompany(company.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <FontAwesomeIcon icon={faRestore} className="h-3 w-3 mr-1" />
                  Restaurer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePermanentDelete(company.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="h-3 w-3 mr-1" />
                  Supprimer définitivement
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Entreprises
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
          Ajouter une entreprise
        </Button>
      </div>

      <div className="relative max-w-md">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher une entreprise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Entreprises actives ({companies.length})
          </TabsTrigger>
          <TabsTrigger value="deleted">
            Corbeille ({deletedCompanies.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          {filteredCompanies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune entreprise trouvée
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="deleted" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeletedCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} isDeleted={true} />
            ))}
          </div>
          {filteredDeletedCompanies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune entreprise dans la corbeille
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
