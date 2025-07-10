import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiLoader } = FiIcons;

const EditModal = ({ 
  isOpen, 
  onClose, 
  title, 
  fields, 
  data, 
  onSave, 
  loading,
  entityType
}) => {
  const [formData, setFormData] = useState({});
  
  // Reset form when modal opens or data changes
  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // Helper to generate input field based on field type
  const renderField = (field) => {
    const { name, label, type, options, placeholder } = field;
    
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="w-full glass-input px-4 py-2"
          >
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            className="w-full glass-input px-4 py-2 h-24 resize-none"
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={formData[name] || 0}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full glass-input px-4 py-2"
          />
        );
      
      default: // text input
        return (
          <input
            type="text"
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            className="w-full glass-input px-4 py-2"
          />
        );
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
            className="w-full max-w-xl glass-card p-0 rounded-xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-800 to-purple-800 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                onClick={onClose}
              >
                <SafeIcon icon={FiX} className="text-white/80 text-lg" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
                    <label className="block text-white/70 mb-2">{field.label}</label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button px-6 py-2 flex items-center space-x-2"
                  disabled={loading}
                >
                  {loading ? <SafeIcon icon={FiLoader} className="animate-spin mr-2" /> : null}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;