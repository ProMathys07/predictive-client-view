
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface AddModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddModel: (model: { name: string; version: string; file?: File }) => void;
}

export default function AddModelDialog({ open, onOpenChange, onAddModel }: AddModelDialogProps) {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const today = new Date().toLocaleDateString('fr-FR');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (name && version) {
      onAddModel({ name, version, file: file || undefined });
      setName('');
      setVersion('');
      setFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau Modèle</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="import" className="text-right">
              Importer
            </Label>
            <div className="col-span-3">
              <input
                type="file"
                id="import"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('import')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="version" className="text-right">
              Version
            </Label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              value={today}
              readOnly
              className="col-span-3 bg-gray-50"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="destructive" onClick={() => onOpenChange(false)}>
            Supprimer
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
