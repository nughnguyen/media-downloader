'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, Music as MusicIcon, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';

interface MediaFormat {
  format_id: string;
  ext: string;
  quality: string;
  filesize: number;
  url: string;
}

interface DownloadResultProps {
  title: string;
  thumbnail?: string;
  url: string;
  formats?: MediaFormat[];
  platform?: string;
  onClose: () => void;
}

export default function DownloadResult({ 
  title, 
  thumbnail, 
  url, 
  formats = [],
  platform,
  onClose 
}: DownloadResultProps) {
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'image'>('video');
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat | null>(null);
  const [noWatermark, setNoWatermark] = useState(false);

  const isTikTok = platform?.toLowerCase().includes('tiktok') || url.includes('tiktok');

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleDownload = () => {
    const downloadUrl = selectedFormat?.url || url;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title}.${selectedFormat?.ext || 'mp4'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mediaTypes = [
    { type: 'video' as const, icon: Play, label: 'Video' },
    { type: 'audio' as const, icon: MusicIcon, label: 'Audio' },
    { type: 'image' as const, icon: ImageIcon, label: 'Image' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left: Thumbnail & Info */}
          <div className="space-y-4">
            {/* Thumbnail */}
            <div className="relative rounded-2xl overflow-hidden bg-black/20 aspect-video">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="h-20 w-20 text-white/20" />
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">{title}</h3>
              {platform && (
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                  {platform}
                </span>
              )}
            </div>
          </div>

          {/* Right: Download Options */}
          <div className="space-y-6">
            {/* Media Type Selection */}
            <div>
              <p className="text-sm text-white/60 mb-3">Chọn loại media:</p>
              <div className="grid grid-cols-3 gap-2">
                {mediaTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      selectedType === type
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TikTok No Watermark Option */}
            {isTikTok && selectedType === 'video' && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <button
                  onClick={() => setNoWatermark(!noWatermark)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${
                    noWatermark
                      ? 'bg-cyan-500 border-cyan-500'
                      : 'bg-transparent border-white/30'
                  }`}
                >
                  {noWatermark && <CheckCircle2 className="h-4 w-4 text-white" />}
                </button>
                <div>
                  <p className="text-sm font-medium text-white">Không có watermark</p>
                  <p className="text-xs text-white/60">Tải video không logo TikTok</p>
                </div>
              </div>
            )}

            {/* Quality & Format Selection */}
            {formats.length > 0 && (
              <div>
                <p className="text-sm text-white/60 mb-3">Chọn chất lượng:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {formats.slice(0, 8).map((format, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFormat(format)}
                      className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between ${
                        selectedFormat?.format_id === format.format_id
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-white/5 border-white/10 text-white/80 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{format.quality}</span>
                        <span className="text-xs opacity-60">{format.ext.toUpperCase()}</span>
                      </div>
                      <span className="text-xs font-mono">{formatFileSize(format.filesize)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Download className="h-5 w-5 group-hover:animate-bounce" />
              Tải xuống
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
