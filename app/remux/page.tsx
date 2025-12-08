'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Loader2, Video } from 'lucide-react';
import { useSettingsStore } from '@/store/settings-store';

export default function RemuxPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { language } = useSettingsStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemux = () => {
    // TODO: Implement remux logic
    alert(language === 'en' ? 'Remux functionality coming soon!' : 'Chức năng remux sắp ra mắt!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {language === 'en' ? 'Media Remux' : 'Remux Media'}
            </h1>
            <p className="text-xl text-white/70">
              {language === 'en'
                ? 'Convert media files without re-encoding'
                : 'Chuyển đổi tệp media mà không cần mã hóa lại'}
            </p>
          </div>

          {/* Upload Area */}
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileSelect}
              accept="video/*,audio/*"
              className="hidden"
            />

            {!selectedFile ? (
              <label
                htmlFor="file-upload"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="block p-12 rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {language === 'en' ? 'Upload Media File' : 'Tải Lên Tệp Media'}
                  </h3>
                  <p className="text-white/60">
                    {language === 'en'
                      ? 'Click to browse or drag and drop'
                      : 'Nhấp để duyệt hoặc kéo và thả'}
                  </p>
                  <p className="text-sm text-white/40 mt-2">
                    {language === 'en' ? 'Supports video and audio files' : 'Hỗ trợ tệp video và audio'}
                  </p>
                </div>
              </label>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <File className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1 truncate">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-white/60">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>

                    {isUploading && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/70">
                            {language === 'en' ? 'Uploading...' : 'Đang tải lên...'}
                          </span>
                          <span className="text-sm text-white/70">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex gap-4 mt-6">
                  {!isUploading && uploadProgress < 100 && (
                    <button
                      onClick={handleUpload}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Upload className="h-5 w-5" />
                      {language === 'en' ? 'Upload' : 'Tải Lên'}
                    </button>
                  )}

                  <button
                    onClick={handleRemux}
                    disabled={uploadProgress < 100}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {language === 'en' ? 'Processing...' : 'Đang xử lý...'}
                      </>
                    ) : (
                      <>
                        <Video className="h-5 w-5" />
                        {language === 'en' ? 'Start Remux' : 'Bắt Đầu Remux'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === 'en' ? 'What is Remuxing?' : 'Remux là gì?'}
              </h3>
              <p className="text-white/70 text-sm">
                {language === 'en'
                  ? 'Remuxing changes the container format without re-encoding, maintaining original quality while being much faster.'
                  : 'Remux thay đổi định dạng container mà không mã hóa lại, duy trì chất lượng gốc và nhanh hơn nhiều.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                {language === 'en' ? 'Supported Formats' : 'Định Dạng Hỗ Trợ'}
              </h3>
              <p className="text-white/70 text-sm">
                {language === 'en'
                  ? 'MP4, MKV, AVI, MOV, WebM, and more. Convert between formats seamlessly.'
                  : 'MP4, MKV, AVI, MOV, WebM và nhiều hơn nữa. Chuyển đổi giữa các định dạng một cách liền mạch.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
