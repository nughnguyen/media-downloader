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

interface MediaImage {
  url: string;
  width: number;
  height: number;
  ext: string;
}

interface DownloadResultProps {
  title: string;
  thumbnail?: string;
  url: string;
  formats?: MediaFormat[];
  images?: MediaImage[];
  is_image_post?: boolean;
  platform?: string;
  onClose: () => void;
}

export default function DownloadResult({ 
  title, 
  thumbnail, 
  url, 
  formats = [],
  images = [],
  is_image_post = false,
  platform,
  onClose 
}: DownloadResultProps) {
  // Auto-detect and set initial tab based on content type
  const getInitialTab = () => {
    // Check if URL contains 'photo' (TikTok image posts)
    const urlLower = url.toLowerCase();
    if (urlLower.includes('photo') || is_image_post || images.length > 0) {
      return 'image';
    }
    return 'video';
  };

  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'image'>(getInitialTab());
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat | null>(null);

  // Debug: Log received data
  console.log('DownloadResult Data:', { title, thumbnail, url, formats, platform });

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Helper: Check if URL is from YouTube/Google Video (CORS restricted)
  const isYouTubeOrGoogleVideo = (downloadUrl: string) => {
    return downloadUrl.includes('googlevideo.com') || 
           downloadUrl.includes('youtube.com') ||
           downloadUrl.includes('youtu.be');
  };

  // Helper: Universal download handler
  const handleDownloadFile = (downloadUrl: string, fileName: string) => {
    // For YouTube/Google Video, skip fetch and open directly (avoid CORS)
    if (isYouTubeOrGoogleVideo(downloadUrl)) {
      console.log('[Download] YouTube detected - opening in new tab');
      window.open(downloadUrl, '_blank');
      return;
    }

    // For other platforms, try fetch first
    console.log('[Download] Trying fetch download:', downloadUrl);
    fetch(downloadUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.log('[Download] Fetch failed, opening in new tab:', error);
        // Fallback: open in new tab
        window.open(downloadUrl, '_blank');
      });
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
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {mediaTypes.map(({ type, icon: Icon, label }) => {
                const hasContent = (() => {
                  switch(type) {
                    case 'audio':
                      return formats.filter((f: any) => 
                        (f.ext === 'm4a' || f.ext === 'mp3' || f.ext === 'webm' || f.ext === 'opus') ||
                        (f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none')) ||
                        f.quality?.toLowerCase().includes('audio') ||
                        f.quality?.toLowerCase().includes('kbps') ||
                        f.format_id?.toLowerCase().includes('audio')
                      ).length > 0;
                    case 'image':
                      return formats.filter((f: any) => 
                        f.ext === 'jpg' || f.ext === 'jpeg' || f.ext === 'png' || 
                        f.ext === 'webp' || f.ext === 'gif'
                      ).length > 0 || !!thumbnail;
                    default: // video
                      return formats.filter((f: any) => {
                        const hasVideo = f.vcodec && f.vcodec !== 'none';
                        const isVideoFormat = f.ext === 'mp4' || f.ext === 'webm' || f.ext === 'mkv' || f.ext === 'mov';
                        const hasResolution = f.height || f.width || f.quality?.match(/\d+p/);
                        const notAudioOnly = !f.quality?.toLowerCase().includes('audio only') && 
                                            !f.quality?.toLowerCase().includes('kbps');
                        return (hasVideo || isVideoFormat || hasResolution) && notAudioOnly;
                      }).length > 0;
                  }
                })();

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-300 ${
                      selectedType === type
                        ? 'border-red-500 text-red-500'
                        : 'border-transparent text-white/60 hover:text-white/80'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Image Preview Grid - Show for any image content (Carousel or Thumbnail) */}
            {selectedType === 'image' && (images.length > 0 || thumbnail) && (
              <div className="mb-4">
                <p className="text-sm text-white/60 mb-3">
                  {images.length > 0 ? `Preview (${images.length} images):` : 'Thumbnail Preview:'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {(images.length > 0 ? images : [{ url: thumbnail!, width: 0, height: 0, ext: 'jpg' }]).map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
                        const fileName = `${safeTitle}_${index + 1}.${image.ext}`;
                        handleDownloadFile(image.url, fileName);
                      }}
                    >
                      <img
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {/* Overlay with download icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <Download className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" />
                      </div>
                      {/* Image number badge */}
                      {images.length > 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/70 text-white text-xs font-semibold">
                          #{index + 1}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Table - Hide for images as requested */}
            {selectedType !== 'image' && (
            <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-white/80">File type</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-white/80">Format</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-white/80">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFormats.length > 0 ? (
                    filteredFormats.slice(0, 10).map((format: any, index: number) => {
                      const fileType = (() => {
                        if (selectedType === 'audio') {
                          const match = format.quality?.match(/(\d+)kbps/);
                          if (match) {
                            return `MP3 - ${match[1]}kbps`;
                          }
                          return `${format.ext.toUpperCase()} - Audio`;
                        } else if (selectedType === 'video') {
                          if (format.height) {
                            return `${format.height}p (.${format.ext})`;
                          }
                          return `${format.quality || 'Video'} (.${format.ext})`;
                        }
                        return `${format.width || ''}x${format.height || ''} (.${format.ext})`;
                      })();

                      return (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white/90">{fileType}</td>
                          <td className="px-4 py-3 text-white/70">Auto</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                const downloadUrl = format.url || url;
                                const safeTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
                                const fileName = `${safeTitle}.${format.ext}`;
                                handleDownloadFile(downloadUrl, fileName);
                              }}
                              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 flex items-center gap-2 text-sm"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-white/50 text-sm">
                        Không có định dạng {selectedType === 'audio' ? 'âm thanh' : 'video'} khả dụng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
