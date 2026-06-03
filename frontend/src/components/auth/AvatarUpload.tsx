'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Camera, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  uid: string;
  url: string | null;
  onUpload: (url: string) => void;
  className?: string;
}

export function AvatarUpload({ uid, url, onUpload, className }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onUpload(publicUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="h-28 w-28 rounded-3xl bg-surface border border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 shadow-xl relative">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={url} 
              alt="Avatar" 
              className="h-full w-full object-cover" 
            />
          ) : (
            <User className="h-12 w-12 text-muted/30" />
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        disabled={uploading}
        accept="image/*"
        className="hidden"
      />
      
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/40">
        {uploading ? 'Processing Image...' : 'Click to change avatar'}
      </p>
    </div>
  );
}
