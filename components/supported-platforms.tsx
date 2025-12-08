'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Youtube, Instagram, Music, Facebook, Twitter, Headphones, Radio, Video, MessageCircle, Film, Image as ImageIcon, PinIcon } from 'lucide-react';

export default function SupportedPlatforms() {
  const [isOpen, setIsOpen] = useState(false);

  const platforms = [
    { name: 'YouTube', icon: Youtube, color: '#FF0000' },
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { name: 'TikTok', icon: Music, color: '#000000' },
    { name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { name: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
    { name: 'Spotify', icon: Headphones, color: '#1DB954' },
    { name: 'SoundCloud', icon: Radio, color: '#FF3300' },
    { name: 'Twitch', icon: Video, color: '#9146FF' },
    { name: 'Reddit', icon: MessageCircle, color: '#FF4500' },
    { name: 'Vimeo', icon: Film, color: '#1AB7EA' },
    { name: 'Dailymotion', icon: Video, color: '#0066DC' },
    { name: 'Pinterest', icon: PinIcon, color: '#E60023' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 mb-4"
          >
            <div className="p-5 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Nền tảng hỗ trợ</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                {platforms.map((platform, index) => {
                  const Icon = platform.icon;
                  return (
                    <motion.div
                      key={platform.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${platform.color}20` }}
                      >
                        <Icon
                          className="h-5 w-5 transition-transform group-hover:scale-110"
                          style={{ color: platform.color }}
                        />
                      </div>
                      <span className="text-xs text-white/80 text-center font-medium leading-tight">
                        {platform.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-5 py-3 rounded-full transition-all duration-300 shadow-lg flex items-center gap-3 ${
          isOpen
            ? 'bg-gradient-to-r from-purple-600 to-blue-600'
            : 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20'
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="h-5 w-5 text-white" />
        </motion.div>
        <span className="text-sm font-medium text-white">
          {isOpen ? 'Đóng' : 'Nền tảng hỗ trợ'}
        </span>
      </motion.button>
    </div>
  );
}
