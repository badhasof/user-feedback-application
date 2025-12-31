"use client";

import { useCallback, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: "square" | "wide";
  maxSizeMB?: number;
  label?: string;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = "square",
  maxSizeMB = 2,
  label = "Upload image",
  disabled = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const displayUrl = preview || value;

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return "Please upload a JPG, PNG, WebP, or GIF image";
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File size must be less than ${maxSizeMB}MB`;
      }
      return null;
    },
    [maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onChange(file);
    },
    [validateFile, onChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError(null);
    onChange(null);
    onRemove?.();
  }, [onChange, onRemove]);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all overflow-hidden",
          aspectRatio === "square" ? "aspect-square" : "aspect-video",
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-white/10 hover:border-white/20",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </>
        ) : (
          <label
            className={cn(
              "flex flex-col items-center justify-center w-full h-full p-4",
              !disabled && "cursor-pointer"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
            ) : (
              <>
                <div className="w-12 h-12 bg-[#1E1E1E] rounded-xl flex items-center justify-center mb-3">
                  {dragActive ? (
                    <Upload className="w-6 h-6 text-blue-400" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-400" />
                  )}
                </div>
                <span className="text-sm text-neutral-400 text-center">
                  {dragActive ? "Drop to upload" : label}
                </span>
                <span className="text-xs text-neutral-500 mt-1">
                  JPG, PNG, WebP or GIF (max {maxSizeMB}MB)
                </span>
              </>
            )}
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleChange}
              disabled={disabled || isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
