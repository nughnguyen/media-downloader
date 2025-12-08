'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settings-store';
import { Server, Check, X } from 'lucide-react';
import ShareComponent from '@/components/share-component';

export default function AboutPage() {
  const { language } = useSettingsStore();
  const [serverStatus, setServerStatus] = useState<'checking' | 'external' | 'internal'>('checking');

  useEffect(() => {
    // Check server status
    const checkStatus = async () => {
      try {
        // Try to ping external API
        const response = await fetch('/api/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }),
        });

        const data = await response.json();
        
        if (data.source === 'external') {
          setServerStatus('external');
        } else if (data.source === 'internal') {
          setServerStatus('internal');
        }
      } catch (error) {
        setServerStatus('internal');
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {language === 'en' ? 'About' : 'Giới Thiệu'}
          </h1>
          <p className="text-xl text-white/70 mb-12">
            {language === 'en'
              ? 'Learn more about MediaDown'
              : 'Tìm hiểu thêm về MediaDown'}
          </p>

          <div className="space-y-6">
            {/* Server Status */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="h-5 w-5" />
                {language === 'en' ? 'Server Status' : 'Trạng Thái Máy Chủ'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <span className="text-white/70">
                    {language === 'en' ? 'External API' : 'API Bên Ngoài'}
                  </span>
                  {serverStatus === 'external' ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">
                        {language === 'en' ? 'Active' : 'Hoạt Động'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <X className="h-5 w-5" />
                      <span className="font-medium">
                        {language === 'en' ? 'Unavailable' : 'Không Khả Dụng'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <span className="text-white/70">
                    {language === 'en' ? 'Internal Engine (Python)' : 'Công Cụ Nội Bộ (Python)'}
                  </span>
                  {serverStatus === 'internal' || serverStatus === 'external' ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">
                        {serverStatus === 'internal'
                          ? (language === 'en' ? 'Running' : 'Đang Chạy')
                          : (language === 'en' ? 'Standby' : 'Chờ')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span className="font-medium">
                        {language === 'en' ? 'Checking...' : 'Đang Kiểm Tra...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {serverStatus === 'internal' && (
                <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-300">
                    {language === 'en'
                      ? '🔧 Server Status: Running Internal Engine - External API is currently unavailable, using Python fallback.'
                      : '🔧 Trạng Thái Máy Chủ: Đang Chạy Công Cụ Nội Bộ - API bên ngoài hiện không khả dụng, đang sử dụng Python dự phòng.'}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'en' ? 'Features' : 'Tính Năng'}
              </h3>
              
              <ul className="space-y-3">
                {[
                  language === 'en'
                    ? 'Download from multiple platforms'
                    : 'Tải xuống từ nhiều nền tảng',
                  language === 'en'
                    ? 'Hybrid backend with automatic fallback'
                    : 'Backend hybrid với dự phòng tự động',
                  language === 'en'
                    ? 'Media remuxing without quality loss'
                    : 'Remux media không mất chất lượng',
                  language === 'en'
                    ? 'Real-time processing queue'
                    : 'Hàng đợi xử lý thời gian thực',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-white/70">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'en' ? 'Technology Stack' : 'Công Nghệ'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Next.js 14', desc: 'Frontend & API' },
                  { name: 'TypeScript', desc: 'Type Safety' },
                  { name: 'Python', desc: 'yt-dlp Engine' },
                  { name: 'Zustand', desc: 'State Management' },
                ].map((tech) => (
                  <div key={tech.name} className="p-4 rounded-xl bg-white/5">
                    <div className="font-medium text-white">{tech.name}</div>
                    <div className="text-sm text-white/60">{tech.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Version */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  v1.0.0
                </div>
                <p className="text-white/60">
                  {language === 'en'
                    ? 'Powered by Quoc Hung'
                    : 'Được xây dựng bởi Quốc Hưng'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
