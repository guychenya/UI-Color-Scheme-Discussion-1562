import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseData = (table, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(table)
        .select('*')
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
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export const useSupabaseInsert = (table) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const insert = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
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

  const update = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
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

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

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