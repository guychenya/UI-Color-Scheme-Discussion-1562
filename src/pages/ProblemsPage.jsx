import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData, useSupabaseInsert, useSupabaseDelete } from '../hooks/useSupabaseData';

const { FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiLoader } = FiIcons;

const ProblemsPage = () => {
  const { data: problems, loading, error, refetch } = useSupabaseData('problems_telos2024');
  const { insert, loading: insertLoading } = useSupabaseInsert('problems_telos2024');
  const { deleteItem, loading: deleteLoading } = useSupabaseDelete('problems_telos2024');

  const [newProblem, setNewProblem] = useState({
    priority: 'Medium',
    description: '',
    impact: '',
    actions: '',
    status: 'Active'
  });

  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const addProblem = async () => {
    if (newProblem.description.trim()) {
      try {
        await insert(newProblem);
        setNewProblem({ priority: 'Medium', description: '', impact: '', actions: '', status: 'Active' });
        setShowForm(false);
        refetch();
      } catch (err) {
        console.error('Error adding problem:', err);
      }
    }
  };

  const deleteProblem = async (id) => {
    try {
      setDeletingId(id);
      await deleteItem(id);
      refetch();
    } catch (err) {
      console.error('Error deleting problem:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiLoader} className="text-6xl text-white/50 mx-auto mb-4 animate-spin" />
          <p className="text-white/70 text-lg">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiAlertCircle} className="text-6xl text-red-400 mx-auto mb-4" />
          <p className="text-white/70 text-lg">Error loading problems: {error}</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <SafeIcon icon={FiAlertCircle} className="mr-3 text-red-400" />
              Problems Management
            </h1>
            <p className="text-white/70 text-lg">Identify and track strategic problems</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-button px-6 py-3 flex items-center space-x-2"
            disabled={insertLoading}
          >
            <SafeIcon icon={insertLoading ? FiLoader : FiPlus} className={insertLoading ? 'animate-spin' : ''} />
            <span>{insertLoading ? 'Adding...' : 'Add Problem'}</span>
          </button>
        </div>
      </motion.div>

      {/* Add Problem Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Add New Problem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-2">Priority</label>
              <select
                value={newProblem.priority}
                onChange={(e) => setNewProblem({...newProblem, priority: e.target.value})}
                className="w-full glass-input px-4 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 mb-2">Status</label>
              <select
                value={newProblem.status}
                onChange={(e) => setNewProblem({...newProblem, status: e.target.value})}
                className="w-full glass-input px-4 py-2"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 mb-2">Description</label>
              <textarea
                value={newProblem.description}
                onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                placeholder="Describe the problem..."
                className="w-full glass-input px-4 py-2 h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Impact</label>
              <textarea
                value={newProblem.impact}
                onChange={(e) => setNewProblem({...newProblem, impact: e.target.value})}
                placeholder="Describe the impact..."
                className="w-full glass-input px-4 py-2 h-20 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Proposed Actions</label>
              <textarea
                value={newProblem.actions}
                onChange={(e) => setNewProblem({...newProblem, actions: e.target.value})}
                placeholder="What actions will you take?"
                className="w-full glass-input px-4 py-2 h-20 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              disabled={insertLoading}
            >
              Cancel
            </button>
            <button
              onClick={addProblem}
              className="glass-button px-6 py-2"
              disabled={insertLoading || !newProblem.description.trim()}
            >
              {insertLoading ? 'Adding...' : 'Add Problem'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Problems Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '12%'}}>Priority</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '40%'}}>Description</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '20%'}}>Impact</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '15%'}}>Status</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '13%'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <motion.tr
                  key={problem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="table-row hover:bg-white/5 transition-colors"
                >
                  <td className="table-cell">
                    <span className={`priority-${problem.priority.toLowerCase()}`}>
                      {problem.priority}
                    </span>
                  </td>
                  <td className="table-cell">
                    <p className="text-white text-sm leading-relaxed">{problem.description}</p>
                  </td>
                  <td className="table-cell">
                    <p className="text-white/80 text-sm">{problem.impact}</p>
                  </td>
                  <td className="table-cell">
                    <span className={`status-${problem.status.toLowerCase()}`}>
                      {problem.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                        <SafeIcon icon={FiEdit2} className="text-sm" />
                      </button>
                      <button
                        onClick={() => deleteProblem(problem.id)}
                        className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                        disabled={deletingId === problem.id}
                      >
                        <SafeIcon 
                          icon={deletingId === problem.id ? FiLoader : FiTrash2} 
                          className={`text-sm ${deletingId === problem.id ? 'animate-spin' : ''}`} 
                        />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {problems.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiAlertCircle} className="text-6xl text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No problems identified yet</p>
            <p className="text-white/40 text-sm">Click "Add Problem" to get started</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProblemsPage;