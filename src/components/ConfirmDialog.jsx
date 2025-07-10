import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAlertTriangle, FiCheck, FiX, FiLoader } = FiIcons;

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading, type = 'delete' }) => {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return FiAlertTriangle;
      case 'complete':
        return FiCheck;
      default:
        return FiAlertTriangle;
    }
  };
  
  const getColor = () => {
    switch (type) {
      case 'delete':
        return 'from-red-600 to-pink-600';
      case 'complete':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-indigo-600 to-purple-600';
    }
  };
  
  const getActionText = () => {
    switch (type) {
      case 'delete':
        return loading ? 'Deleting...' : 'Delete';
      case 'complete':
        return loading ? 'Completing...' : 'Complete';
      default:
        return loading ? 'Confirming...' : 'Confirm';
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md glass-card p-0 rounded-xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getColor()} p-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <SafeIcon icon={getIcon()} className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                onClick={onClose}
              >
                <SafeIcon icon={FiX} className="text-white/80 text-lg" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-white/80 mb-6">{message}</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-6 py-2 rounded-lg flex items-center space-x-2 text-white font-medium bg-gradient-to-r ${getColor()}`}
                  disabled={loading}
                >
                  {loading ? <SafeIcon icon={FiLoader} className="animate-spin mr-2" /> : null}
                  <span>{getActionText()}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;