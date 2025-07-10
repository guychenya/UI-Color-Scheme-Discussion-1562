import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData } from '../hooks/useSupabaseData';

const { FiBarChart3, FiTrendingUp, FiPieChart, FiActivity, FiLoader } = FiIcons;

const AnalyticsPage = () => {
  const { data: problems, loading: problemsLoading } = useSupabaseData('problems_telos2024');
  const { data: goals, loading: goalsLoading } = useSupabaseData('goals_telos2024');
  const { data: missions, loading: missionsLoading } = useSupabaseData('missions_telos2024');
  const { data: challenges, loading: challengesLoading } = useSupabaseData('challenges_telos2024');

  const analytics = useMemo(() => {
    if (problemsLoading || goalsLoading || missionsLoading || challengesLoading) {
      return null;
    }

    // Calculate priority distribution
    const allItems = [...problems, ...goals, ...challenges];
    const priorityCount = allItems.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {});

    // Calculate status distribution
    const statusCount = {
      problems: problems.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {}),
      goals: goals.reduce((acc, g) => {
        acc[g.status] = (acc[g.status] || 0) + 1;
        return acc;
      }, {}),
      challenges: challenges.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {})
    };

    return {
      priorityCount,
      statusCount,
      totalProblems: problems.length,
      totalGoals: goals.length,
      totalMissions: missions.length,
      totalChallenges: challenges.length,
      completedGoals: goals.filter(g => g.status === 'Completed').length,
      activeChallenges: challenges.filter(c => c.status === 'Active').length,
      avgProgress: goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length || 0
    };
  }, [problems, goals, missions, challenges, problemsLoading, goalsLoading, missionsLoading, challengesLoading]);

  const priorityDistribution = useMemo(() => {
    if (!analytics) return {};

    return {
      title: {
        text: 'Priority Distribution',
        textStyle: { color: '#ffffff' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: '#ffffff' }
      },
      series: [
        {
          name: 'Priority',
          type: 'pie',
          radius: '50%',
          data: [
            { value: analytics.priorityCount.High || 0, name: 'High Priority' },
            { value: analytics.priorityCount.Medium || 0, name: 'Medium Priority' },
            { value: analytics.priorityCount.Low || 0, name: 'Low Priority' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }, [analytics]);

  const statusDistribution = useMemo(() => {
    if (!analytics) return {};

    return {
      title: {
        text: 'Status Distribution',
        textStyle: { color: '#ffffff' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Active', 'Pending', 'Completed'],
        textStyle: { color: '#ffffff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: '#ffffff' }
      },
      yAxis: {
        type: 'category',
        data: ['Problems', 'Goals', 'Challenges'],
        axisLabel: { color: '#ffffff' }
      },
      series: [
        {
          name: 'Active',
          type: 'bar',
          stack: 'total',
          data: [
            analytics.statusCount.problems.Active || 0,
            analytics.statusCount.goals.Active || 0,
            analytics.statusCount.challenges.Active || 0
          ],
          itemStyle: { color: '#10b981' }
        },
        {
          name: 'Pending',
          type: 'bar',
          stack: 'total',
          data: [
            analytics.statusCount.problems.Pending || 0,
            analytics.statusCount.goals.Pending || 0,
            analytics.statusCount.challenges.Pending || 0
          ],
          itemStyle: { color: '#f59e0b' }
        },
        {
          name: 'Completed',
          type: 'bar',
          stack: 'total',
          data: [
            analytics.statusCount.problems.Resolved || 0,
            analytics.statusCount.goals.Completed || 0,
            analytics.statusCount.challenges.Completed || 0
          ],
          itemStyle: { color: '#6366f1' }
        }
      ]
    };
  }, [analytics]);

  const kpiCards = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        title: 'Total Problems',
        value: analytics.totalProblems.toString(),
        change: '+0',
        changeType: 'neutral',
        icon: FiBarChart3,
        color: 'from-red-500 to-pink-500'
      },
      {
        title: 'Goals Progress',
        value: `${Math.round(analytics.avgProgress)}%`,
        change: '+5%',
        changeType: 'increase',
        icon: FiTrendingUp,
        color: 'from-green-500 to-emerald-500'
      },
      {
        title: 'Active Challenges',
        value: analytics.activeChallenges.toString(),
        change: '0',
        changeType: 'neutral',
        icon: FiActivity,
        color: 'from-orange-500 to-yellow-500'
      },
      {
        title: 'Mission Statements',
        value: analytics.totalMissions.toString(),
        change: '+0',
        changeType: 'neutral',
        icon: FiPieChart,
        color: 'from-blue-500 to-cyan-500'
      }
    ];
  }, [analytics]);

  if (problemsLoading || goalsLoading || missionsLoading || challengesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiLoader} className="text-6xl text-white/50 mx-auto mb-4 animate-spin" />
          <p className="text-white/70 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
          <SafeIcon icon={FiBarChart3} className="mr-3 text-blue-400" />
          Analytics Dashboard
        </h1>
        <p className="text-white/70 text-lg">Track your strategic planning performance and insights</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                <SafeIcon icon={kpi.icon} className="text-white text-xl" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                kpi.changeType === 'increase' ? 'text-green-400' : 
                kpi.changeType === 'decrease' ? 'text-red-400' : 
                'text-gray-400'
              }`}>
                <span>{kpi.change}</span>
                <SafeIcon icon={FiTrendingUp} className="text-xs" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-white/70 text-sm">{kpi.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-6"
        >
          <ReactECharts
            option={priorityDistribution}
            style={{ height: '400px' }}
            theme="dark"
          />
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-6"
        >
          <ReactECharts
            option={statusDistribution}
            style={{ height: '400px' }}
            theme="dark"
          />
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass-card p-6 mt-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Problem Management</h3>
            <p className="text-white/70 text-sm">
              You have {analytics?.totalProblems || 0} problems tracked. Focus on high-priority items first.
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Goal Progress</h3>
            <p className="text-white/70 text-sm">
              Average goal progress is {Math.round(analytics?.avgProgress || 0)}%. Keep pushing towards completion.
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Strategic Alignment</h3>
            <p className="text-white/70 text-sm">
              {analytics?.totalMissions || 0} mission statements provide strategic direction for your organization.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;