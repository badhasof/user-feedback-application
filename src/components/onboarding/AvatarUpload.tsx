"use client";

import React, { useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Camera, User } from 'lucide-react';

interface AvatarUploadProps {
  name: string;
  currentAvatarUrl?: string;
  onAvatarChange: (storageId: Id<"_storage"> | undefined) => void;
}

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getInitialsColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-rose-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  name,
  currentAvatarUrl,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const generateUploadUrl = useMutation(api.userProfiles.generateUploadUrl);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Convex
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error('Upload failed');
      }

      const { storageId } = await result.json();
      onAvatarChange(storageId as Id<"_storage">);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreviewUrl(currentAvatarUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onAvatarChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const initials = getInitials(name);
  const initialsColor = getInitialsColor(name);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div
          className={`
            w-24 h-24 rounded-full overflow-hidden border-2 border-authBorder
            flex items-center justify-center text-2xl font-medium text-white
            ${!previewUrl ? initialsColor : 'bg-[#1f1f1f]'}
            transition-all duration-200
          `}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : name ? (
            initials
          ) : (
            <User className="w-10 h-10 text-textMuted" />
          )}
        </div>

        {/* Hover overlay */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`
            absolute inset-0 rounded-full bg-black/50 flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            cursor-pointer disabled:cursor-not-allowed
          `}
        >
          {uploading ? (
            <svg
              className="w-6 h-6 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-authPrimary hover:text-authPrimaryHover transition-colors disabled:opacity-50"
        >
          {previewUrl ? 'Change' : 'Upload photo'}
        </button>
        {previewUrl && (
          <>
            <span className="text-textMuted">·</span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="text-textMuted hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
};
