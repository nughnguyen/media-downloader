'use client';

import { useQueueStore } from '@/store/queue-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function FloatingQueue() {
  const { items, isVisible, toggleVisibility, removeItem, clearCompleted } = useQueueStore();

  if (items.length === 0) return null;

  const completedCount = items.filter((item) => item.status === 'completed').length;
  const processingCount = items.filter((item) => item.status === 'processing').length;
  const failedCount = items.filter((item) => item.status === 'failed').length;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={toggleVisibility}
        className="mb-3 ml-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <Download className="h-5 w-5" />
        <span className="font-medium">{items.length} Downloads</span>
        {isVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </motion.button>

      {/* Queue Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-96 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Processing Queue</h3>
                <button
                  onClick={clearCompleted}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Clear Completed
                </button>
              </div>
              
              <div className="flex gap-4 text-sm">
                <span className="text-blue-300">Processing: {processingCount}</span>
                <span className="text-green-300">Completed: {completedCount}</span>
                <span className="text-red-300">Failed: {failedCount}</span>
              </div>
            </div>

            {/* Queue Items */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar p-3 space-y-2">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.status === 'processing' && (
                            <Loader2 className="h-4 w-4 text-blue-400 animate-spin flex-shrink-0" />
                          )}
                          {item.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          )}
                          {item.status === 'failed' && (
                            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                          )}
                          
                          <h4 className="text-sm font-medium text-white truncate">
                            {item.title}
                          </h4>
                        </div>

                        {item.status === 'processing' && (
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            />
                          </div>
                        )}

                        {item.error && (
                          <p className="text-xs text-red-300 mt-1">{item.error}</p>
                        )}

                        {item.source && (
                          <p className="text-xs text-white/50 mt-1">
                            Source: {item.source === 'external' ? 'External API' : 'Internal Engine'}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex-shrink-0 text-white/50 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
