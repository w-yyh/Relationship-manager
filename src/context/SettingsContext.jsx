import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

const SettingsContext = createContext();

export const DEFAULT_THRESHOLDS = {
  CORE_POWER: { xMin: 7, yMin: 7, zMin: 7 },
  STRATEGIC_GOAL: { xMin: 7, yMin: 7, zMax: 4 },
  EXECUTION_FORCE: { xMin: 7, zMin: 7, yMax: 5 },
  PRESTIGE_LEVERAGE: { yMin: 7, xMax: 5 },
};

export function SettingsProvider({ children }) {
  const { token } = useAuth();
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const isInitialMount = useRef(true);

  // Load settings from API on mount/token change
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/api/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data) setThresholds(data);
      })
      .catch(err => console.error('Failed to load settings:', err));
    }
  }, [token]);

  // Save settings to API when changed (debounce could be added here)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (token) {
      fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(thresholds)
      }).catch(err => console.error('Failed to save settings:', err));
    }
  }, [thresholds, token]);

  const updateThreshold = (category, key, value) => {
    setThresholds(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: Number(value)
      }
    }));
  };

  const addRule = (category, key, value) => {
    setThresholds(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: Number(value)
      }
    }));
  };

  const removeRule = (category, key) => {
    setThresholds(prev => {
      const newCategoryRules = { ...prev[category] };
      delete newCategoryRules[key];
      return {
        ...prev,
        [category]: newCategoryRules
      };
    });
  };

  const resetSettings = () => {
    setThresholds(DEFAULT_THRESHOLDS);
  };

  return (
    <SettingsContext.Provider value={{ thresholds, updateThreshold, addRule, removeRule, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
