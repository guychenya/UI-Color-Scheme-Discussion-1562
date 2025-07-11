import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AuthModal from '../components/AuthModal';

const { FiCompass, FiTarget, FiAlertCircle, FiZap, FiBarChart3, FiUsers, FiLock, FiTrendingUp } = FiIcons;

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: FiAlertCircle,
      title: 'Problem Tracking',
      description: 'Identify and prioritize strategic challenges with impact assessment and action planning.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: FiTarget,
      title: 'Goal Management',
      description: 'Set measurable objectives with progress tracking and success criteria.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiCompass,
      title: 'Mission Statements',
      description: 'Define your organizational purpose and strategic direction clearly.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: FiZap,
      title: 'Challenge Resolution',
      description: 'Track obstacles and develop innovative solutions across different categories.',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: FiBarChart3,
      title: 'Analytics Dashboard',
      description: 'Gain insights with comprehensive reporting and performance metrics.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Work together on strategic initiatives with role-based access control.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiCompass} className="text-white text-2xl" />
            </div>
            <span className="text-3xl font-bold gradient-text">Telos</span>
          </div>
          
          <motion.button
            onClick={() => setShowAuthModal(true)}
            className="glass-button px-8 py-3 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-medium">Get Started</span>
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              Strategic Planning
              <span className="block gradient-text">Made Simple</span>
            </h1>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Telos helps organizations identify problems, set goals, define missions, and track challenges 
              with powerful analytics and intuitive workflows.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setShowAuthModal(true)}
                className="glass-button px-8 py-4 text-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Everything You Need</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Comprehensive tools for strategic planning, execution, and monitoring
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8 hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <SafeIcon icon={feature.icon} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/70">Organizations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/70">Goals Achieved</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                <div className="text-white/70">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/70">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Strategy?</h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of organizations using Telos to achieve their strategic objectives.
            </p>
            <motion.button
              onClick={() => setShowAuthModal(true)}
              className="glass-button px-12 py-4 text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiCompass} className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold gradient-text">Telos</span>
          </div>
          <p className="text-white/60">© 2024 Telos. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default LandingPage;