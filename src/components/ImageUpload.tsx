
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faImage } from '@fortawesome/free-solid-svg-icons';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  currentImage?: string;
  placeholder?: string;
}

export default function ImageUpload({ onFileSelect, currentImage, placeholder = "URL du logo" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image (PNG, JPG, SVG)');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faImage} className="h-4 w-4 text-gray-400" />
        <Input
          value={previewUrl}
          onChange={(e) => setPreviewUrl(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
        >
          <FontAwesomeIcon icon={faUpload} className="h-4 w-4 mr-1" />
          Importer
        </Button>
      </div>
      
      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Aperçu du logo"
            className="h-16 w-16 object-contain border border-gray-200 rounded"
          />
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
