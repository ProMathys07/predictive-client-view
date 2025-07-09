
import React, { useState } from 'react';
import { Company, CompanyFormData, PACKS } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faBuilding, faImage } from '@fortawesome/free-solid-svg-icons';

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
    }
  });

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
              <Label htmlFor="pack">Pack sélectionné *</Label>
              <Select value={formData.pack} onValueChange={(value: Company['pack']) => 
                setFormData(prev => ({ ...prev, pack: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pack" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PACKS).map(([key, pack]) => (
                    <SelectItem key={key} value={key}>
                      {pack.name} - {pack.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="logo">Logo/Image (URL)</Label>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faImage} className="h-4 w-4 text-gray-400" />
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="URL du logo"
                />
              </div>
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
