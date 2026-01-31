import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const SETTINGS_KEY = 'social-capital-settings';

export const DEFAULT_THRESHOLDS = {
  CORE_POWER: { xMin: 7, yMin: 7, zMin: 7 },
  STRATEGIC_GOAL: { xMin: 7, yMin: 7, zMax: 4 },
  EXECUTION_FORCE: { xMin: 7, zMin: 7, yMax: 5 },
  PRESTIGE_LEVERAGE: { yMin: 7, xMax: 5 },
};

export function SettingsProvider({ children }) {
  const [thresholds, setThresholds] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(thresholds));
  }, [thresholds]);

  const updateThreshold = (category, key, value) => {
    setThresholds(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: Number(value)
      }
    }));
  };

  const resetSettings = () => {
    setThresholds(DEFAULT_THRESHOLDS);
  };

  return (
    <SettingsContext.Provider value={{ thresholds, updateThreshold, resetSettings }}>
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
