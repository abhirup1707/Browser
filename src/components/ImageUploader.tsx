import React, { useRef, useState, useEffect } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES } from '../services/sampleImages';
import type { SampleImage, SubjectCategory } from '../types/joke';

interface ImageUploaderProps {
  onImageSelected: (dataUrl: string, fileInfo?: { name: string; type: string; category?: SubjectCategory }) => void;
  onOpenWebcam: () => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onOpenWebcam,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clipboard paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, or GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, { name: file.name, type: file.type });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`w-full relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${
          isDragging
            ? 'border-orange-500 bg-orange-500/10 scale-[1.01] shadow-2xl shadow-orange-500/20'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70 hover:shadow-xl'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {/* Pulsing visual glow */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-orange-500/20 via-amber-500/20 to-rose-500/20 flex items-center justify-center mb-4 ring-1 ring-orange-500/30 group-hover:scale-105 transition-transform">
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 animate-bounce" />
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1.5">
          Drop your picture here, or{' '}
          <span className="text-orange-400 underline underline-offset-4">browse</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
          Upload any selfie, awkward group photo, pet pic, messy room, or food fail. Supports JPG, PNG, WEBP, GIF.
        </p>

        {/* Action Buttons inside Dropzone */}
        <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 hover:scale-105"
          >
            <ImageIcon className="w-4 h-4" />
            Select Photo
          </button>

          <button
            type="button"
            onClick={onOpenWebcam}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-105"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            Take Live Selfie
          </button>
        </div>

        <div className="mt-5 text-[11px] text-slate-500 flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
            Ctrl + V
          </kbd>
          <span>to paste from clipboard directly</span>
        </div>
      </div>

      {/* Instant Hilarious Sample Gallery */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-slate-200">
            Or test instantly with one of these hilarious pics:
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAMPLE_IMAGES.map((sample: SampleImage) => (
            <button
              key={sample.id}
              onClick={() => onImageSelected(sample.dataUrl, { name: `${sample.id}.svg`, type: 'image/svg+xml', category: sample.subjectCategory })}
              disabled={isLoading}
              className="group relative rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-orange-500/50 p-2 text-left transition-all hover:scale-[1.03] shadow-md flex flex-col overflow-hidden"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-950 mb-2 relative">
                <img
                  src={sample.dataUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/75 text-orange-300 backdrop-blur-sm">
                  {sample.category}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-orange-400 line-clamp-1">
                {sample.title}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {sample.hint}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
