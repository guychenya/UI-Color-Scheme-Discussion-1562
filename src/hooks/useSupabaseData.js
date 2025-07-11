import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useSupabaseData = (table, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setData([]);
        return;
      }

      const { data: result, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, ...dependencies]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export const useSupabaseInsert = (table) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const insert = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: result, error } = await supabase
        .from(table)
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error inserting data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { insert, loading, error };
};

export const useSupabaseUpdate = (table) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const update = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error updating data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export const useSupabaseDelete = (table) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
};