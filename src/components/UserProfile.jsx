import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiUser, FiLogOut, FiSettings, FiChevronDown, FiEdit2, FiSave, FiX } = FiIcons;

const UserProfile = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || ''
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(editData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    return user?.email?.split('@')[0] || 'User';
  };

  const getAvatarUrl = () => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url;
  };

  if (!user) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {getAvatarUrl() ? (
            <img 
              src={getAvatarUrl()} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <SafeIcon icon={FiUser} className="text-white text-sm" />
          )}
        </div>
        <span className="text-white font-medium text-sm hidden md:block">
          {getDisplayName()}
        </span>
        <SafeIcon 
          icon={FiChevronDown} 
          className={`text-white/70 text-sm transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl overflow-hidden z-50"
          >
            {/* Profile Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-800 to-purple-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {getAvatarUrl() ? (
                    <img 
                      src={getAvatarUrl()} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SafeIcon icon={FiUser} className="text-white text-lg" />
                  )}
                </div>
                <div className="flex-1">
                  {editMode ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editData.full_name}
                        onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                        className="glass-input px-2 py-1 text-sm"
                        placeholder="Full name"
                      />
                      <button
                        onClick={handleUpdateProfile}
                        className="p-1 text-green-400 hover:text-green-300"
                      >
                        <SafeIcon icon={FiSave} className="text-sm" />
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <SafeIcon icon={FiX} className="text-sm" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div>
                        <h3 className="text-white font-medium">{getDisplayName()}</h3>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                      <button
                        onClick={() => setEditMode(true)}
                        className="p-1 text-white/60 hover:text-white"
                      >
                        <SafeIcon icon={FiEdit2} className="text-sm" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="p-4 border-b border-white/10">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-white font-semibold text-lg">0</p>
                  <p className="text-white/60 text-xs">Active Goals</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">0</p>
                  <p className="text-white/60 text-xs">Completed</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Add settings functionality here
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <SafeIcon icon={FiSettings} className="text-white/70" />
                <span className="text-white">Settings</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 transition-colors text-left"
              >
                <SafeIcon icon={FiLogOut} className="text-red-400" />
                <span className="text-red-400">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;