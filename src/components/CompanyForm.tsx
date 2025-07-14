import React, { useState, useEffect } from 'react';
import { Company, CompanyFormData, PACKS } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faBuilding } from '@fortawesome/free-solid-svg-icons';
import ImageUpload from '@/components/ImageUpload';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function CompanyForm({ company, onSubmit, onCancel, isEditing = false }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company?.name || '',
    description: company?.description || '',
    pack: company?.pack || 'diagnostic',
    logo: company?.logo || '',
    contact: {
      email: company?.contact.email || '',
      phone: company?.contact.phone || '',
      address: company?.contact.address || ''
    },
    access: {
      identifier: company?.access.identifier || '',
      configurationLink: company?.access.configurationLink || '',
      gcpId: company?.access.gcpId || ''
    }
  });

  // Générer automatiquement le lien de configuration quand l'identifiant change
  useEffect(() => {
    if (formData.access.identifier) {
      const link = `https://config.aidatapme.com/${formData.access.identifier}@client`;
      setFormData(prev => ({
        ...prev,
        access: {
          ...prev.access,
          configurationLink: link
        }
      }));
    }
  }, [formData.access.identifier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleContactChange = (field: keyof CompanyFormData['contact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleAccessChange = (field: keyof CompanyFormData['access'], value: string) => {
    setFormData(prev => ({
      ...prev,
      access: {
        ...prev.access,
        [field]: value
      }
    }));
  };

  const handleLogoFileSelect = (file: File) => {
    setFormData(prev => ({
      ...prev,
      logoFile: file,
      logo: URL.createObjectURL(file)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-blue-600" />
          {isEditing ? 'Modifier l\'entreprise' : 'Ajouter une entreprise'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de l'entreprise *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'entreprise"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="pack">Étapes du client *</Label>
              <Select value={formData.pack} onValueChange={(value: Company['pack']) => 
                setFormData(prev => ({ ...prev, pack: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une étape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="prototype">Prototype</SelectItem>
                  <SelectItem value="deploiement">Déploiement</SelectItem>
                  <SelectItem value="abonnement">Abonnement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="logo">Logo/Image</Label>
              <ImageUpload
                onFileSelect={handleLogoFileSelect}
                currentImage={formData.logo}
                placeholder="URL du logo ou importer un fichier"
              />
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="contact@entreprise.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                value={formData.contact.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="01 23 45 67 89"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.contact.address}
                onChange={(e) => handleContactChange('address', e.target.value)}
                placeholder="Adresse complète"
              />
            </div>
          </div>

          {/* Section Accès */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Accès</h3>
            
            <div>
              <Label htmlFor="identifier">Identifiant *</Label>
              <div className="flex items-center">
                <Input
                  id="identifier"
                  value={formData.access.identifier}
                  onChange={(e) => handleAccessChange('identifier', e.target.value)}
                  placeholder="identifiant"
                  required
                  className="rounded-r-none"
                />
                <span className="bg-gray-100 border border-l-0 border-input px-3 py-2 rounded-r-md text-sm text-gray-600">
                  @client
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="configurationLink">Lien de configuration</Label>
              <Input
                id="configurationLink"
                value={formData.access.configurationLink}
                readOnly
                className="bg-gray-100"
                placeholder="Le lien sera généré automatiquement"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ce lien sera envoyé automatiquement au client lors de l'ajout
              </p>
            </div>

            <div>
              <Label htmlFor="gcpId">ID GCP *</Label>
              <Input
                id="gcpId"
                value={formData.access.gcpId}
                onChange={(e) => handleAccessChange('gcpId', e.target.value)}
                placeholder="ID du projet Google Cloud Platform"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Connecte le client à son projet Google Cloud Platform
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <FontAwesomeIcon icon={faSave} className="h-4 w-4 mr-2" />
              {isEditing ? 'Modifier' : 'Ajouter'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
