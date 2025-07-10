import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData, useSupabaseInsert, useSupabaseDelete } from '../hooks/useSupabaseData';

const { FiPlus, FiEdit2, FiTrash2, FiCompass, FiLoader } = FiIcons;

const MissionPage = () => {
  const { data: missions, loading, error, refetch } = useSupabaseData('missions_telos2024');
  const { insert, loading: insertLoading } = useSupabaseInsert('missions_telos2024');
  const { deleteItem, loading: deleteLoading } = useSupabaseDelete('missions_telos2024');

  const [newMission, setNewMission] = useState({
    statement: '',
    related_problems: '',
    category: 'Core Mission'
  });

  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const addMission = async () => {
    if (newMission.statement.trim()) {
      try {
        await insert(newMission);
        setNewMission({ statement: '', related_problems: '', category: 'Core Mission' });
        setShowForm(false);
        refetch();
      } catch (err) {
        console.error('Error adding mission:', err);
      }
    }
  };

  const deleteMission = async (id) => {
    try {
      setDeletingId(id);
      await deleteItem(id);
      refetch();
    } catch (err) {
      console.error('Error deleting mission:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiLoader} className="text-6xl text-white/50 mx-auto mb-4 animate-spin" />
          <p className="text-white/70 text-lg">Loading missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <SafeIcon icon={FiCompass} className="text-6xl text-red-400 mx-auto mb-4" />
          <p className="text-white/70 text-lg">Error loading missions: {error}</p>
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
              <SafeIcon icon={FiCompass} className="mr-3 text-purple-400" />
              Mission Statements
            </h1>
            <p className="text-white/70 text-lg">Define your organizational purpose and direction</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-button px-6 py-3 flex items-center space-x-2"
            disabled={insertLoading}
          >
            <SafeIcon icon={insertLoading ? FiLoader : FiPlus} className={insertLoading ? 'animate-spin' : ''} />
            <span>{insertLoading ? 'Adding...' : 'Add Mission'}</span>
          </button>
        </div>
      </motion.div>

      {/* Add Mission Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Add New Mission Statement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-white/70 mb-2">Mission Statement</label>
              <textarea
                value={newMission.statement}
                onChange={(e) => setNewMission({...newMission, statement: e.target.value})}
                placeholder="Write your mission statement..."
                className="w-full glass-input px-4 py-2 h-32 resize-none"
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Category</label>
              <select
                value={newMission.category}
                onChange={(e) => setNewMission({...newMission, category: e.target.value})}
                className="w-full glass-input px-4 py-2"
              >
                <option value="Core Mission">Core Mission</option>
                <option value="Operational Mission">Operational Mission</option>
                <option value="Values Mission">Values Mission</option>
                <option value="Vision Mission">Vision Mission</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 mb-2">Related Problems</label>
              <textarea
                value={newMission.related_problems}
                onChange={(e) => setNewMission({...newMission, related_problems: e.target.value})}
                placeholder="What problems does this mission address?"
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
              onClick={addMission}
              className="glass-button px-6 py-2"
              disabled={insertLoading || !newMission.statement.trim()}
            >
              {insertLoading ? 'Adding...' : 'Add Mission'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Mission Cards */}
      <div className="space-y-6">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M{index + 1}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm font-medium">{mission.category}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </button>
                <button
                  onClick={() => deleteMission(mission.id)}
                  className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                  disabled={deletingId === mission.id}
                >
                  <SafeIcon 
                    icon={deletingId === mission.id ? FiLoader : FiTrash2} 
                    className={`text-sm ${deletingId === mission.id ? 'animate-spin' : ''}`} 
                  />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Mission Statement</h3>
              <p className="text-white/80 leading-relaxed">{mission.statement}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Related Problems</h4>
              <p className="text-white/60 text-sm">{mission.related_problems}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {missions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <SafeIcon icon={FiCompass} className="text-6xl text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg mb-2">No mission statements defined yet</p>
          <p className="text-white/40 text-sm">Click "Add Mission" to create your first mission statement</p>
        </motion.div>
      )}
    </div>
  );
};

export default MissionPage;