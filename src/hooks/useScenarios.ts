"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { CalculatorInputs } from '@/types/calculator';

export interface SavedScenario {
  id: string;
  name: string;
  description?: string;
  data: CalculatorInputs;
  createdAt: number;
  updatedAt: number;
}

export function useScenarios() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserAndScenarios = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        loadScenarios(user);
      }
    };
    getUserAndScenarios();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (event === 'SIGNED_IN') {
        loadScenarios(currentUser!);
      }
      if (event === 'SIGNED_OUT') {
        setScenarios([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadScenarios = async (currentUser: User) => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scenarios');
      if (!response.ok) {
        throw new Error('Failed to load scenarios');
      }
      const data = await response.json();
      setScenarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const saveScenario = async (name: string, data: CalculatorInputs, description?: string) => {
    if (!user) {
      throw new Error('Please sign in to save scenarios');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save scenario');
      }

      const newScenario = await response.json();
      setScenarios(prev => [...prev, newScenario]);
      return newScenario;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save scenario';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteScenario = async (id: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/scenarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete scenario');
      }

      setScenarios(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete scenario');
    } finally {
      setLoading(false);
    }
  };

  return {
    scenarios,
    loading,
    error,
    saveScenario,
    deleteScenario,
    loadScenarios: () => user ? loadScenarios(user) : Promise.resolve(),
    isAuthenticated: !!user,
  };
}

