'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settings-store';
import { Heart, Copy, Check, ExternalLink, Building2, Download } from 'lucide-react';
import ShareComponent from '@/components/share-component';

export default function DonatePage() {
  const { language } = useSettingsStore();
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');

  const donationMethods = [
    {
      name: 'Zypage',
      link: 'https://zypage.com/gumballz',
      description: language === 'en' ? 'Support via Zypage' : 'Hỗ trợ qua Zypage',
    },
  ];

  // VietQR Configuration for OCB Bank
  const bankInfo = {
    bankCode: '970448', // OCB bank code
    accountNumber: '0388205003', // Replace with your actual account number
    accountName: 'NGUYEN QUOC HUNG', // Replace with your actual account name
    defaultMessage: 'Ung Ho GumballZ', // Default transaction description
  };

  // Quick amount presets
  const quickAmounts = [
    { value: '10000', label: '10,000đ' },
    { value: '20000', label: '20,000đ' },
    { value: '50000', label: '50,000đ' },
  ];

  // Generate VietQR URL
  const getVietQRUrl = (amount: string, message: string, template: 'compact' | 'compact2' = 'compact') => {
    const finalAmount = amount || '';
    const finalMessage = message || bankInfo.defaultMessage;
    return `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-${template}.jpg?amount=${finalAmount}&addInfo=${encodeURIComponent(finalMessage)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
  };

  const [currentQRUrl, setCurrentQRUrl] = useState(getVietQRUrl('', bankInfo.defaultMessage));

  const handleQuickAmount = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setCurrentQRUrl(getVietQRUrl(amount, customMessage || bankInfo.defaultMessage));
  };

  const handleGenerateCustomQR = () => {
    const amount = customAmount || selectedAmount;
    const message = customMessage || bankInfo.defaultMessage;
    setCurrentQRUrl(getVietQRUrl(amount, message));
  };

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(bankInfo.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = async () => {
    const amount = customAmount || selectedAmount;
    const message = customMessage || bankInfo.defaultMessage;
    const downloadUrl = getVietQRUrl(amount, message, 'compact2');

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vietqr-${selectedAmount || 'custom'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      // Fallback
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'donate.jpg';
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              {language === 'en' ? 'Support Us' : 'Hỗ Trợ Chúng Tôi'}
            </h1>
            
            <p className="text-xl text-white/70">
              {language === 'en'
                ? 'Help us keep this service free and running'
                : 'Giúp chúng tôi duy trì dịch vụ miễn phí'}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - VietQR Only */}
            <div className="space-y-6">
              {/* VietQR Bank Transfer Section */}
              <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
                {/* Header with Download Button */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">
                      {language === 'en' ? 'Bank Transfer (VietQR)' : 'Chuyển Khoản Ngân Hàng (VietQR)'}
                    </h3>
                  </div>
                  
                  {/* Small Download Button in Corner */}
                  <button
                    onClick={handleDownloadQR}
                    className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 group"
                    title={language === 'en' ? 'Download QR Code' : 'Tải Mã QR'}
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Top Row: QR Code & Bank Info */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* QR Code Column */}
                    <div className="flex-shrink-0 flex justify-center items-center p-4 rounded-2xl bg-white shadow-lg h-fit">
                      <img
                        src={currentQRUrl}
                        alt="VietQR Code"
                        className="w-48 h-48 object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Bank Info Column */}
                    <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center space-y-4 h-full min-h-[224px]">
                      {/* Bank Name */}
                      <div>
                        <p className="text-xs text-white/60 mb-1">
                          {language === 'en' ? 'Bank:' : 'Ngân Hàng:'}
                        </p>
                        <p className="text-sm font-bold text-white uppercase tracking-wide">
                         OCB - NGAN HANG PHUONG DONG
                        </p>
                      </div>

                       {/* Account Name */}
                      <div>
                        <p className="text-xs text-white/60 mb-1">
                          {language === 'en' ? 'Account Name:' : 'Chủ Tài Khoản:'}
                        </p>
                        <p className="text-sm font-bold text-white uppercase tracking-wide">
                          {bankInfo.accountName}
                        </p>
                      </div>

                      {/* Account Number */}
                      <div>
                        <p className="text-xs text-white/60 mb-2">
                          {language === 'en' ? 'Account Number:' : 'Số Tài Khoản:'}
                        </p>
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/10 group hover:border-white/30 transition-all">
                          <code className="flex-1 text-base font-mono text-white/90 tracking-wider">
                            {bankInfo.accountNumber}
                          </code>
                          <button
                            onClick={handleCopyAccountNumber}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                            title={language === 'en' ? 'Copy Account Number' : 'Sao chép STK'}
                          >
                            {copied ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Row: Quick Amount Buttons */}
                  <div className="flex flex-col items-center gap-2">
                     <p className="text-sm text-white/60">
                      {language === 'en' ? 'Quick Amount:' : 'Mệnh Giá Nhanh:'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount.value}
                          onClick={() => handleQuickAmount(amount.value)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap text-sm ${
                            selectedAmount === amount.value
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                              : 'bg-white/10 text-white/80 hover:bg-white/20 hover:scale-102'
                          }`}
                        >
                          {amount.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row: Custom Inputs */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/60 mb-2 block">
                          {language === 'en' ? 'Custom Amount:' : 'Mức Khác (VND):'}
                        </label>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount('');
                          }}
                          placeholder="Ví dụ: 50000"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60 mb-2 block">
                          {language === 'en' ? 'Message:' : 'Lời Nhắn:'}
                        </label>
                        <input
                          type="text"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder={bankInfo.defaultMessage}
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleGenerateCustomQR}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white font-medium hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      {language === 'en' ? 'Update QR Code' : 'Cập Nhật Mã QR'}
                    </button>
                  </div>
                  
                  <p className="text-xs text-white/50 text-center italic">
                    {language === 'en'
                      ? 'Scan VietQR code with your banking app to transfer instantly'
                      : 'Quét mã VietQR bằng ứng dụng ngân hàng để chuyển khoản ngay'}
                  </p>
                </div>
            </div>
            </div>

            {/* Right Column - Zypage & Share */}
            <div className="space-y-6">
              {/* Zypage Link */}
              {donationMethods.map((method) => (
                <div key={method.name} className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {method.name}
                  </h3>
                  <p className="text-sm text-white/60 mb-4">
                    {method.description}
                  </p>
                  
                  <a
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <ExternalLink className="h-5 w-5" />
                    {language === 'en' ? 'Visit Zypage' : 'Truy Cập Zypage'}
                  </a>
                </div>
              ))}

              {/* Share Section */}
              <ShareComponent />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-pink-600/10 to-red-600/10 border border-pink-500/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              {language === 'en' ? 'Thank You! 💖' : 'Cảm Ơn Bạn! 💖'}
            </h3>
            <p className="text-white/70">
              {language === 'en'
                ? 'Your support helps us maintain and improve this service for everyone'
                : 'Sự hỗ trợ của bạn giúp chúng tôi duy trì và cải thiện dịch vụ cho mọi người'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
