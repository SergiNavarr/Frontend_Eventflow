"use client";

import { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    onChange(file);
  };

  const handleClear = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-4 w-full">
      {preview ? (
        <div className="relative w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center min-h-[200px]">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-[400px] w-full object-contain" 
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-md"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition hover:bg-muted/50">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <label className="mt-4 cursor-pointer text-sm font-semibold text-primary hover:underline">
            Seleccionar imagen
            <Input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={disabled} 
            />
          </label>
        </div>
      )}
    </div>
  );
};