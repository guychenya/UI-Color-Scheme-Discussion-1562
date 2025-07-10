import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiAlertCircle, FiTarget, FiCompass, FiZap, FiBarChart3 } = FiIcons;

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/problems', label: 'Problems', icon: FiAlertCircle },
    { path: '/goals', label: 'Goals', icon: FiTarget },
    { path: '/mission', label: 'Mission', icon: FiCompass },
    { path: '/challenges', label: 'Challenges', icon: FiZap },
    { path: '/analytics', label: 'Analytics', icon: FiBarChart3 }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 rounded-2xl">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <SafeIcon icon={FiCompass} className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold gradient-text">Telos</span>
        </Link>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/20 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative flex items-center space-x-2">
                <SafeIcon 
                  icon={item.icon} 
                  className={`text-lg ${location.pathname === item.path ? 'text-white' : 'text-white/70'}`} 
                />
                <span className={`font-medium ${location.pathname === item.path ? 'text-white' : 'text-white/70'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;