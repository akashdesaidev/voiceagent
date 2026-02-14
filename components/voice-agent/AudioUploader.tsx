"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileAudio, X } from "lucide-react";

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
}

export function AudioUploader({ onFileSelected }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setError("");
    
    // Validate file type
    const allowedTypes = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/webm", "audio/ogg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload WAV, MP3, WEBM, or OGG files.");
      return;
    }
    
    // Validate file size (25MB max)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 25MB limit.");
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
  };
  
  const handleClear = () => {
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };
  
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">📁 Upload Audio File</h3>
          <p className="text-sm text-muted-foreground">
            WAV, MP3, WEBM, OGG (max 25MB)
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {!selectedFile ? (
          <Button
            size="lg"
            variant="outline"
            className="w-full border-2 border-dashed hover:border-purple-500 hover:bg-purple-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5 mr-2" />
            Choose File
          </Button>
        ) : (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <FileAudio className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
