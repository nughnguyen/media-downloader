'use client';

import { useState } from 'react';
import { useQueueStore } from '@/store/queue-store';
import { useSettingsStore } from '@/store/settings-store';
import { motion } from 'framer-motion';
import { Download, Sparkles, Youtube, Instagram, Music } from 'lucide-react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);
  const { addItem, updateItem } = useQueueStore();
  const { quickPaste, language } = useSettingsStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsProcessing(true);
    
    // Add to queue
    const itemId = Math.random().toString(36).substring(7);
    addItem(url);
    
    // Update the newly added item
    const items = useQueueStore.getState().items;
    const newItem = items[items.length - 1];
    
    if (newItem) {
      updateItem(newItem.id, { status: 'processing', progress: 20 });

      try {
        // Call API
        const response = await fetch('/api/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (data.success) {
          updateItem(newItem.id, {
            status: 'completed',
            progress: 100,
            title: data.title || 'Download Ready',
            thumbnail: data.thumbnail,
            source: data.source,
          });
        } else {
          updateItem(newItem.id, {
            status: 'failed',
            error: data.message || 'Failed to process URL',
          });
        }
      } catch (error) {
        updateItem(newItem.id, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Network error',
        });
      }
    }

    setUrl('');
    setIsProcessing(false);
  };

  const handlePaste = async () => {
    if (quickPaste) {
      try {
        const text = await navigator.clipboard.readText();
        setUrl(text);
      } catch (err) {
        console.error('Failed to read clipboard:', err);
      }
    }
  };

  const examplePlatforms = [
    { name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { name: 'TikTok', icon: Music, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              {language === 'en' ? 'Download from any platform' : 'Tải xuống từ mọi nền tảng'}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            {language === 'en' ? 'Media Downloader' : 'Tải Xuống Media'}
          </h1>
          
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Download videos, images, and audio from your favorite platforms with our powerful hybrid engine'
              : 'Tải xuống video, hình ảnh và âm thanh từ các nền tảng yêu thích với công cụ hybrid mạnh mẽ'}
          </p>

          {/* Download Form */}
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onClick={handlePaste}
                placeholder={language === 'en' ? 'Paste your link here...' : 'Dán liên kết tại đây...'}
                className={`w-full px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border-2 transition-all duration-300 text-white placeholder-white/50 outline-none ${
                  focused
                    ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                    : 'border-white/20 hover:border-white/30'
                }`}
              />
              
              <button
                type="submit"
                disabled={isProcessing || !url.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                {isProcessing ? (language === 'en' ? 'Processing...' : 'Đang xử lý...') : (language === 'en' ? 'Download' : 'Tải xuống')}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Platform Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {examplePlatforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <platform.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{platform.name}</h3>
              <p className="text-sm text-white/60">
                {language === 'en'
                  ? `Download from ${platform.name}`
                  : `Tải xuống từ ${platform.name}`}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">
              {language === 'en' ? 'External API First' : 'API Bên Ngoài Ưu Tiên'}
            </h3>
            <p className="text-white/70">
              {language === 'en'
                ? 'We try external services first for the fastest response'
                : 'Chúng tôi thử dịch vụ bên ngoài trước để có phản hồi nhanh nhất'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-blue-600/5 border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">
              {language === 'en' ? 'Internal Fallback' : 'Dự Phòng Nội Bộ'}
            </h3>
            <p className="text-white/70">
              {language === 'en'
                ? 'If external API fails, our Python engine takes over'
                : 'Nếu API bên ngoài thất bại, công cụ Python của chúng tôi sẽ xử lý'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
