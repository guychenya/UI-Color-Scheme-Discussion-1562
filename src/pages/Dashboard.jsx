import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData } from '../hooks/useSupabaseData';

const { FiAlertCircle, FiTarget, FiCompass, FiZap, FiTrendingUp, FiCheckCircle, FiClock, FiArrowRight, FiLoader } = FiIcons;

const Dashboard = () => {
  const { data: problems, loading: problemsLoading } = useSupabaseData('problems_telos2024');
  const { data: goals, loading: goalsLoading } = useSupabaseData('goals_telos2024');
  const { data: missions, loading: missionsLoading } = useSupabaseData('missions_telos2024');
  const { data: challenges, loading: challengesLoading } = useSupabaseData('challenges_telos2024');
  const { data: activityLog, loading: activityLoading } = useSupabaseData('activity_log_telos2024');

  const stats = [
    { 
      label: 'Active Problems', 
      value: problemsLoading ? '...' : problems.filter(p => p.status === 'Active').length.toString(), 
      icon: FiAlertCircle, 
      color: 'from-red-500 to-pink-500', 
      path: '/problems' 
    },
    { 
      label: 'Goals Set', 
      value: goalsLoading ? '...' : goals.length.toString(), 
      icon: FiTarget, 
      color: 'from-blue-500 to-cyan-500', 
      path: '/goals' 
    },
    { 
      label: 'Mission Statements', 
      value: missionsLoading ? '...' : missions.length.toString(), 
      icon: FiCompass, 
      color: 'from-purple-500 to-indigo-500', 
      path: '/mission' 
    },
    { 
      label: 'Challenges', 
      value: challengesLoading ? '...' : challenges.length.toString(), 
      icon: FiZap, 
      color: 'from-orange-500 to-yellow-500', 
      path: '/challenges' 
    }
  ];

  const getRecentActivity = () => {
    if (activityLoading || !activityLog) return [];
    
    // Create recent activity from actual data
    const recentItems = [];
    
    // Add recent problems
    const recentProblems = problems.slice(0, 2).map(p => ({
      type: 'problem',
      title: `Problem: ${p.description.substring(0, 50)}...`,
      time: new Date(p.created_at).toLocaleDateString(),
      status: p.priority.toLowerCase()
    }));
    
    // Add recent goals
    const recentGoals = goals.slice(0, 2).map(g => ({
      type: 'goal',
      title: `Goal: ${g.description.substring(0, 50)}...`,
      time: new Date(g.created_at).toLocaleDateString(),
      status: g.status.toLowerCase()
    }));
    
    return [...recentProblems, ...recentGoals].slice(0, 4);
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Strategic Dashboard</h1>
        <p className="text-white/70 text-lg">Monitor your strategic planning progress and key metrics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link to={stat.path} className="block group">
              <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <SafeIcon icon={stat.icon} className="text-white text-xl" />
                  </div>
                  <SafeIcon icon={FiArrowRight} className="text-white/50 group-hover:text-white/80 transition-colors" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <SafeIcon icon={FiClock} className="text-white/50" />
          </div>
          <div className="space-y-4">
            {activityLoading ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiLoader} className="text-2xl text-white/50 mx-auto mb-2 animate-spin" />
                <p className="text-white/60 text-sm">Loading activity...</p>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'high' ? 'bg-red-500' :
                    activity.status === 'medium' ? 'bg-yellow-500' :
                    activity.status === 'active' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-white/60 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60 text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            <SafeIcon icon={FiTrendingUp} className="text-white/50" />
          </div>
          <div className="space-y-3">
            <Link to="/problems" className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiAlertCircle} className="text-red-400" />
                  <span className="text-white font-medium">Add New Problem</span>
                </div>
                <SafeIcon icon={FiArrowRight} className="text-white/50 group-hover:text-white/80 transition-colors" />
              </div>
            </Link>
            <Link to="/goals" className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiTarget} className="text-blue-400" />
                  <span className="text-white font-medium">Set New Goal</span>
                </div>
                <SafeIcon icon={FiArrowRight} className="text-white/50 group-hover:text-white/80 transition-colors" />
              </div>
            </Link>
            <Link to="/mission" className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiCompass} className="text-purple-400" />
                  <span className="text-white font-medium">Update Mission</span>
                </div>
                <SafeIcon icon={FiArrowRight} className="text-white/50 group-hover:text-white/80 transition-colors" />
              </div>
            </Link>
            <Link to="/challenges" className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiZap} className="text-orange-400" />
                  <span className="text-white font-medium">Track Challenge</span>
                </div>
                <SafeIcon icon={FiArrowRight} className="text-white/50 group-hover:text-white/80 transition-colors" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;