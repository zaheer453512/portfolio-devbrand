'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { mediaApi } from '@/lib/api';

interface MediaItem {
  url: string;
  publicId: string;
  type: 'image' | 'video';
  name: string;
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith('video/');
        const res = isVideo
          ? await mediaApi.uploadVideo(file)
          : await mediaApi.uploadImage(file);

        setMedia(prev => [{
          url: res.data.url,
          publicId: res.data.publicId,
          type: isVideo ? 'video' : 'image',
          name: file.name,
        }, ...prev]);
        toast.success(`${file.name} uploaded!`);
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    try {
      await mediaApi.delete(item.publicId, item.type);
      setMedia(prev => prev.filter(m => m.publicId !== item.publicId));
      toast.success('Media deleted');
      if (preview?.publicId === item.publicId) setPreview(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl text-white">MEDIA</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Manage images and videos on Cloudinary</p>
      </div>

      {/* Upload type toggle */}
      <div className="flex gap-1 bg-[#0D0D0D] border border-[#1a1a1a] p-1 w-fit">
        {(['image', 'video'] as const).map(type => (
          <button
            key={type}
            onClick={() => setUploadType(type)}
            className={`px-4 py-2 font-mono text-xs transition-all capitalize ${
              uploadType === type ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Upload zone */}
      <div
        className={`border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
          dragOver ? 'border-primary bg-primary/5' : 'border-[#222] hover:border-[#444]'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          multiple
          accept={uploadType === 'image' ? 'image/*' : 'video/*'}
          onChange={e => handleUpload(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin text-primary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            <p className="text-primary font-mono text-sm">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {uploadType === 'image' ? (
              <svg className="text-gray-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            ) : (
              <svg className="text-gray-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14"/>
              </svg>
            )}
            <div>
              <p className="text-gray-400 font-medium">Drop {uploadType}s here or click to browse</p>
              <p className="text-gray-600 text-xs mt-1 font-mono">
                {uploadType === 'image' ? 'JPG, PNG, WebP up to 10MB' : 'MP4, WebM, MOV up to 100MB'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Media grid */}
      {media.length > 0 && (
        <div>
          <h2 className="font-display text-xl mb-4">UPLOADED THIS SESSION</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[#1a1a1a]">
            {media.map((item) => (
              <div key={item.publicId} className="group relative bg-[#0D0D0D] aspect-square overflow-hidden">
                {item.type === 'image' ? (
                  <Image src={item.url} alt={item.name} fill className="object-cover" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => setPreview(item)}
                    className="p-2 bg-white/10 hover:bg-white/20 transition-colors"
                    title="Preview"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="p-2 bg-white/10 hover:bg-white/20 transition-colors"
                    title="Copy URL"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 transition-colors text-red-400"
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>

                {/* Type badge */}
                <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5">
                  <span className="font-mono text-[9px] text-gray-400 uppercase">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-[#0D0D0D] border border-[#1a1a1a] p-6">
        <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">About Cloud Storage</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Images', desc: 'Stored in portfolio/images folder on Cloudinary. Auto-optimized with quality:auto.' },
            { title: 'Videos', desc: 'Stored in portfolio/videos folder on Cloudinary. Supports MP4, WebM, MOV formats.' },
            { title: 'Auto Cleanup', desc: 'Deleting a project or review also removes its media from Cloudinary automatically.' },
          ].map(item => (
            <div key={item.title}>
              <div className="text-primary font-mono text-xs mb-1">{item.title}</div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm text-gray-400">{preview.name}</span>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {preview.type === 'image' ? (
              <div className="relative aspect-video">
                <Image src={preview.url} alt={preview.name} fill className="object-contain" />
              </div>
            ) : (
              <video src={preview.url} controls className="w-full" />
            )}
            <div className="mt-4 flex gap-3">
              <button onClick={() => copyUrl(preview.url)} className="btn btn-outline text-xs">Copy URL</button>
              <button onClick={() => { handleDelete(preview); }} className="btn text-xs bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/40">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
