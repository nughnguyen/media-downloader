'use client';

import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settings-store';
import { Moon, Sun, Monitor, Languages, Zap, Copy } from 'lucide-react';

export default function SettingsPage() {
  const {
    theme,
    language,
    reducedMotion,
    quickPaste,
    setTheme,
    setLanguage,
    setReducedMotion,
    setQuickPaste,
  } = useSettingsStore();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {language === 'en' ? 'Settings' : 'Cài Đặt'}
          </h1>
          <p className="text-xl text-white/70 mb-12">
            {language === 'en'
              ? 'Customize your experience'
              : 'Tùy chỉnh trải nghiệm của bạn'}
          </p>

          <div className="space-y-6">
            {/* Theme Setting */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Moon className="h-5 w-5" />
                {language === 'en' ? 'Theme' : 'Giao Diện'}
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                        isActive
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/20 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${isActive ? 'text-purple-400' : 'text-white/70'}`} />
                      <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Setting */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {language === 'en' ? 'Language' : 'Ngôn Ngữ'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    language === 'en'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/20 hover:border-white/30 bg-white/5'
                  }`}
                >
                  <span className={`font-medium ${language === 'en' ? 'text-white' : 'text-white/70'}`}>
                    English
                  </span>
                </button>
                
                <button
                  onClick={() => setLanguage('vi')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    language === 'vi'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/20 hover:border-white/30 bg-white/5'
                  }`}
                >
                  <span className={`font-medium ${language === 'vi' ? 'text-white' : 'text-white/70'}`}>
                    Tiếng Việt
                  </span>
                </button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {language === 'en' ? 'Reduced Motion' : 'Giảm Chuyển Động'}
                  </h3>
                  <p className="text-sm text-white/60">
                    {language === 'en'
                      ? 'Minimize animations for better performance'
                      : 'Giảm thiểu hoạt ảnh để cải thiện hiệu suất'}
                  </p>
                </div>
                
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    reducedMotion ? 'bg-purple-600' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: reducedMotion ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 rounded-full bg-white"
                  />
                </button>
              </div>
            </div>

            {/* Quick Paste */}
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Copy className="h-5 w-5" />
                    {language === 'en' ? 'Quick Paste' : 'Dán Nhanh'}
                  </h3>
                  <p className="text-sm text-white/60">
                    {language === 'en'
                      ? 'Auto-paste from clipboard when clicking the input field'
                      : 'Tự động dán từ clipboard khi nhấp vào trường nhập'}
                  </p>
                </div>
                
                <button
                  onClick={() => setQuickPaste(!quickPaste)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    quickPaste ? 'bg-purple-600' : 'bg-white/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: quickPaste ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 rounded-full bg-white"
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
