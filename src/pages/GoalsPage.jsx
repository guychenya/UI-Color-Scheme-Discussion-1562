import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData, useSupabaseInsert, useSupabaseDelete, useSupabaseUpdate } from '../hooks/useSupabaseData';
import EditModal from '../components/EditModal';
import ConfirmDialog from '../components/ConfirmDialog';

const { FiPlus, FiEdit2, FiTrash2, FiTarget, FiLoader } = FiIcons;

const GoalsPage = () => {
  const { data: goals, loading, error, refetch } = useSupabaseData('goals_telos2024');
  const { insert, loading: insertLoading } = useSupabaseInsert('goals_telos2024');
  const { deleteItem, loading: deleteLoading } = useSupabaseDelete('goals_telos2024');
  const { update, loading: updateLoading } = useSupabaseUpdate('goals_telos2024');

  const [newGoal, setNewGoal] = useState({
    priority: 'Medium',
    description: '',
    timeline: '',
    success_criteria: '',
    status: 'Pending',
    progress: 0
  });

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Field definitions for the edit modal
  const goalFields = [
    { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
    { name: 'timeline', label: 'Timeline', type: 'text', placeholder: 'e.g., Q2 2024' },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    { name: 'success_criteria', label: 'Success Criteria', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Active', 'Completed'] },
    { name: 'progress', label: 'Progress (%)', type: 'number' }
  ];

  const addGoal = async () => {
    if (newGoal.description.trim()) {
      try {
        await insert(newGoal);
        setNewGoal({ 
          priority: 'Medium', 
          description: '', 
          timeline: '', 
          success_criteria: '', 
          status: 'Pending',
          progress: 0
        });
        setShowForm(false);
        refetch();
      } catch (err) {
        console.error('Error adding goal:', err);
      }
    }
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedGoal) => {
    try {
      // Ensure progress is a number
      updatedGoal.progress = Number(updatedGoal.progress);
      await update(updatedGoal.id, updatedGoal);
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const openConfirmDelete = (id) => {
    setDeletingId(id);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(deletingId);
      setIsConfirmDialogOpen(false);
      refetch();
    } catch (err) {
      console.error('Error deleting goal:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiLoader} className="text-6xl text-white/50 mx-auto mb-4 animate-spin" />
          <p className="text-white/70 text-lg">Loading goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiTarget} className="text-6xl text-red-400 mx-auto mb-4" />
          <p className="text-white/70 text-lg">Error loading goals: {error}</p>
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
              <SafeIcon icon={FiTarget} className="mr-3 text-blue-400" />
              Goals Management
            </h1>
            <p className="text-white/70 text-lg">Set and track strategic objectives</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-button px-6 py-3 flex items-center space-x-2"
            disabled={insertLoading}
          >
            <SafeIcon icon={insertLoading ? FiLoader : FiPlus} className={insertLoading ? 'animate-spin' : ''} />
            <span>{insertLoading ? 'Adding...' : 'Add Goal'}</span>
          </button>
        </div>
      </motion.div>

      {/* Add Goal Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Add New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-2">Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                className="w-full glass-input px-4 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 mb-2">Timeline</label>
              <input
                type="text"
                value={newGoal.timeline}
                onChange={(e) => setNewGoal({...newGoal, timeline: e.target.value})}
                placeholder="e.g., Q2 2024"
                className="w-full glass-input px-4 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 mb-2">Description</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Describe your goal..."
                className="w-full glass-input px-4 py-2 h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Success Criteria</label>
              <textarea
                value={newGoal.success_criteria}
                onChange={(e) => setNewGoal({...newGoal, success_criteria: e.target.value})}
                placeholder="How will you measure success?"
                className="w-full glass-input px-4 py-2 h-20 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Status</label>
              <select
                value={newGoal.status}
                onChange={(e) => setNewGoal({...newGoal, status: e.target.value})}
                className="w-full glass-input px-4 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
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
              onClick={addGoal}
              className="glass-button px-6 py-2"
              disabled={insertLoading || !newGoal.description.trim()}
            >
              {insertLoading ? 'Adding...' : 'Add Goal'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Goals Table */}
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
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '30%'}}>Description</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '15%'}}>Timeline</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '20%'}}>Success Criteria</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '10%'}}>Progress</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '8%'}}>Status</th>
                <th className="text-left text-white font-semibold py-3 px-4" style={{width: '5%'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, index) => (
                <motion.tr
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="table-row hover:bg-white/5 transition-colors"
                >
                  <td className="table-cell">
                    <span className={`priority-${goal.priority.toLowerCase()}`}>
                      {goal.priority}
                    </span>
                  </td>
                  <td className="table-cell">
                    <p className="text-white text-sm leading-relaxed">{goal.description}</p>
                  </td>
                  <td className="table-cell">
                    <p className="text-white/80 text-sm">{goal.timeline}</p>
                  </td>
                  <td className="table-cell">
                    <p className="text-white/80 text-sm">{goal.success_criteria}</p>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-white/70 text-xs">{goal.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`status-${goal.status.toLowerCase()}`}>
                      {goal.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => openEditModal(goal)}
                        className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                        disabled={updateLoading}
                      >
                        <SafeIcon icon={FiEdit2} className="text-xs" />
                      </button>
                      <button
                        onClick={() => openConfirmDelete(goal.id)}
                        className="p-1 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                        disabled={deleteLoading}
                      >
                        <SafeIcon 
                          icon={deletingId === goal.id ? FiLoader : FiTrash2} 
                          className={`text-xs ${deletingId === goal.id ? 'animate-spin' : ''}`} 
                        />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {goals.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiTarget} className="text-6xl text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No goals set yet</p>
            <p className="text-white/40 text-sm">Click "Add Goal" to get started</p>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Goal"
        fields={goalFields}
        data={editingGoal}
        onSave={handleSaveEdit}
        loading={updateLoading}
        entityType="goal"
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        loading={deleteLoading}
        type="delete"
      />
    </div>
  );
};

export default GoalsPage;