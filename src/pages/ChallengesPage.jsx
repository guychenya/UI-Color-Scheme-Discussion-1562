import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData, useSupabaseInsert, useSupabaseDelete, useSupabaseUpdate } from '../hooks/useSupabaseData';
import EditModal from '../components/EditModal';
import ConfirmDialog from '../components/ConfirmDialog';

const { FiPlus, FiEdit2, FiTrash2, FiZap, FiLoader } = FiIcons;

const ChallengesPage = () => {
  const { data: challenges, loading, error, refetch } = useSupabaseData('challenges_telos2024');
  const { insert, loading: insertLoading } = useSupabaseInsert('challenges_telos2024');
  const { deleteItem, loading: deleteLoading } = useSupabaseDelete('challenges_telos2024');
  const { update, loading: updateLoading } = useSupabaseUpdate('challenges_telos2024');

  const [newChallenge, setNewChallenge] = useState({
    description: '',
    impact: 'Medium',
    solutions: '',
    status: 'Pending',
    category: 'Operational'
  });

  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Field definitions for the edit modal
  const challengeFields = [
    { name: 'impact', label: 'Impact Level', type: 'select', options: ['Low', 'Medium', 'High'] },
    { name: 'category', label: 'Category', type: 'select', options: ['Operational', 'Financial', 'Technical', 'Quality', 'Innovation', 'Market'] },
    { name: 'description', label: 'Challenge Description', type: 'textarea', fullWidth: true },
    { name: 'solutions', label: 'Proposed Solutions', type: 'textarea' },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Active', 'Completed'] }
  ];

  const addChallenge = async () => {
    if (newChallenge.description.trim()) {
      try {
        await insert(newChallenge);
        setNewChallenge({ 
          description: '', 
          impact: 'Medium', 
          solutions: '', 
          status: 'Pending', 
          category: 'Operational' 
        });
        setShowForm(false);
        refetch();
      } catch (err) {
        console.error('Error adding challenge:', err);
      }
    }
  };

  const openEditModal = (challenge) => {
    setEditingChallenge(challenge);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedChallenge) => {
    try {
      await update(updatedChallenge.id, updatedChallenge);
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Error updating challenge:', err);
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
      console.error('Error deleting challenge:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiLoader} className="text-6xl text-white/50 mx-auto mb-4 animate-spin" />
          <p className="text-white/70 text-lg">Loading challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiZap} className="text-6xl text-red-400 mx-auto mb-4" />
          <p className="text-white/70 text-lg">Error loading challenges: {error}</p>
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
              <SafeIcon icon={FiZap} className="mr-3 text-orange-400" />
              Challenges Management
            </h1>
            <p className="text-white/70 text-lg">Track and resolve strategic challenges</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-button px-6 py-3 flex items-center space-x-2"
            disabled={insertLoading}
          >
            <SafeIcon icon={insertLoading ? FiLoader : FiPlus} className={insertLoading ? 'animate-spin' : ''} />
            <span>{insertLoading ? 'Adding...' : 'Add Challenge'}</span>
          </button>
        </div>
      </motion.div>

      {/* Add Challenge Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Add New Challenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-2">Impact Level</label>
              <select
                value={newChallenge.impact}
                onChange={(e) => setNewChallenge({...newChallenge, impact: e.target.value})}
                className="w-full glass-input px-4 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 mb-2">Category</label>
              <select
                value={newChallenge.category}
                onChange={(e) => setNewChallenge({...newChallenge, category: e.target.value})}
                className="w-full glass-input px-4 py-2"
              >
                <option value="Operational">Operational</option>
                <option value="Financial">Financial</option>
                <option value="Technical">Technical</option>
                <option value="Quality">Quality</option>
                <option value="Innovation">Innovation</option>
                <option value="Market">Market</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 mb-2">Challenge Description</label>
              <textarea
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                placeholder="Describe the challenge..."
                className="w-full glass-input px-4 py-2 h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Proposed Solutions</label>
              <textarea
                value={newChallenge.solutions}
                onChange={(e) => setNewChallenge({...newChallenge, solutions: e.target.value})}
                placeholder="What solutions are you considering?"
                className="w-full glass-input px-4 py-2 h-20 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Status</label>
              <select
                value={newChallenge.status}
                onChange={(e) => setNewChallenge({...newChallenge, status: e.target.value})}
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
              onClick={addChallenge}
              className="glass-button px-6 py-2"
              disabled={insertLoading || !newChallenge.description.trim()}
            >
              {insertLoading ? 'Adding...' : 'Add Challenge'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C{index + 1}</span>
                </div>
                <div>
                  <span className="text-orange-400 text-sm font-medium">{challenge.category}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => openEditModal(challenge)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                  disabled={updateLoading}
                >
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </button>
                <button
                  onClick={() => openConfirmDelete(challenge.id)}
                  className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                  disabled={deleteLoading}
                >
                  <SafeIcon 
                    icon={deletingId === challenge.id ? FiLoader : FiTrash2} 
                    className={`text-sm ${deletingId === challenge.id ? 'animate-spin' : ''}`} 
                  />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-white/80 leading-relaxed text-sm mb-3">{challenge.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-xs">Impact:</span>
                <span className={`priority-${challenge.impact.toLowerCase()}`}>
                  {challenge.impact}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">Status:</span>
                <span className={`status-${challenge.status.toLowerCase()}`}>
                  {challenge.status}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Solutions</h4>
              <p className="text-white/60 text-xs leading-relaxed">{challenge.solutions}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {challenges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <SafeIcon icon={FiZap} className="text-6xl text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg mb-2">No challenges identified yet</p>
          <p className="text-white/40 text-sm">Click "Add Challenge" to track your first challenge</p>
        </motion.div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Challenge"
        fields={challengeFields}
        data={editingChallenge}
        onSave={handleSaveEdit}
        loading={updateLoading}
        entityType="challenge"
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Challenge"
        message="Are you sure you want to delete this challenge? This action cannot be undone."
        loading={deleteLoading}
        type="delete"
      />
    </div>
  );
};

export default ChallengesPage;