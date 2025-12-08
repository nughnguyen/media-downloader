'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, Music as MusicIcon, Image as ImageIcon, X } from 'lucide-react';

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

  // Debug: Log received data
  console.log('DownloadResult Data:', { title, thumbnail, url, formats, platform });

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleDownload = async () => {
    const downloadUrl = selectedFormat?.url || url;
    const fileName = `${title.substring(0, 50)}.${selectedFormat?.ext || 'mp4'}`;
    
    try {
      // Show loading state
      const button = document.querySelector('button[type="download"]');
      if (button) {
        button.textContent = 'Đang tải...';
      }

      // For Cobalt API or direct URLs, try to download via fetch
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(downloadUrl, '_blank');
    }
  };

  // Filter formats based on selected type
  const getFilteredFormats = () => {
    if (!formats || formats.length === 0) return [];
    
    switch (selectedType) {
      case 'audio':
        // Audio-only formats (no video codec or explicitly audio)
        return formats.filter((f: any) => 
          (f.ext === 'm4a' || f.ext === 'mp3' || f.ext === 'webm' || f.ext === 'opus') ||
          (f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none')) ||
          f.quality?.toLowerCase().includes('audio') ||
          f.quality?.toLowerCase().includes('kbps') ||
          f.format_id?.toLowerCase().includes('audio')
        );
      case 'image':
        // Image formats
        return formats.filter((f: any) => 
          f.ext === 'jpg' || f.ext === 'jpeg' || f.ext === 'png' || 
          f.ext === 'webp' || f.ext === 'gif' ||
          f.quality?.toLowerCase().includes('image') ||
          f.quality?.toLowerCase().includes('thumbnail')
        );
      default: // video
        // Video formats (has video codec and may or may not have audio)
        return formats.filter((f: any) => {
          const hasVideo = f.vcodec && f.vcodec !== 'none';
          const isVideoFormat = f.ext === 'mp4' || f.ext === 'webm' || f.ext === 'mkv' || f.ext === 'mov';
          const hasResolution = f.height || f.width || f.quality?.match(/\d+p/);
          const notAudioOnly = !f.quality?.toLowerCase().includes('audio only') && 
                               !f.quality?.toLowerCase().includes('kbps');
          
          return (hasVideo || isVideoFormat || hasResolution) && notAudioOnly;
        });
    }
  };

  const filteredFormats = getFilteredFormats();

  // Format quality display
  const formatQualityDisplay = (format: any) => {
    if (selectedType === 'audio') {
      // For audio, show bitrate if available
      const match = format.quality?.match(/(\d+)kbps/);
      if (match) {
        return `${match[1]} kbps`;
      }
      return format.quality || 'Audio';
    } else if (selectedType === 'video') {
      // For video, show resolution
      if (format.height) {
        return `${format.height}p ${format.quality?.includes('60') ? '60fps' : ''}`.trim();
      }
      return format.quality || 'Video';
    }
    // For images
    return format.quality || `${format.width || ''}x${format.height || ''}`;
  };

  const mediaTypes = [
    { type: 'video' as const, icon: Play, label: 'Video' },
    { type: 'audio' as const, icon: MusicIcon, label: 'Audio (MP3)' },
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
            <div className="relative rounded-2xl overflow-hidden bg-black/20 aspect-video border-2 border-white/10">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20';
                      fallback.innerHTML = '<div class="text-center"><svg class="h-20 w-20 mx-auto text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><p class="text-white/50 text-sm">No preview available</p></div>';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <div className="text-center">
                    <Play className="h-20 w-20 mx-auto text-white/30 mb-2" />
                    <p className="text-white/50 text-sm">No preview available</p>
                  </div>
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
              <p className="text-sm text-white/60 mb-3">Chọn loại tải xuống:</p>
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
                    <span className="text-xs font-medium text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality & Format Selection */}
            {filteredFormats.length > 0 ? (
              <div>
                <p className="text-sm text-white/60 mb-3">
                  {selectedType === 'video' && 'Chọn độ phân giải:'}
                  {selectedType === 'audio' && 'Chọn chất lượng âm thanh:'}
                  {selectedType === 'image' && 'Chọn kích thước:'}
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredFormats.slice(0, 15).map((format: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFormat(format)}
                      className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        selectedFormat?.format_id === format.format_id
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-white/5 border-white/10 text-white/80 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-base font-semibold">
                          {formatQualityDisplay(format)}
                        </span>
                        <span className="text-xs opacity-70">
                          {format.ext.toUpperCase()}
                          {format.vcodec && format.vcodec !== 'none' && selectedType === 'video' && (
                            <> • {format.vcodec.split('.')[0]}</>
                          )}
                          {format.acodec && format.acodec !== 'none' && selectedType === 'audio' && (
                            <> • {format.acodec.split('.')[0]}</>
                          )}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-semibold">
                          {formatFileSize(format.filesize)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/50 text-sm">
                Không có định dạng {selectedType === 'audio' ? 'âm thanh' : selectedType === 'image' ? 'hình ảnh' : 'video'} khả dụng
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!url}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
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
