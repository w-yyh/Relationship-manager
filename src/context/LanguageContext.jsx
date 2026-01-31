import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const LANGUAGE_KEY = 'social-capital-language';

export const TRANSLATIONS = {
  en: {
    settings: {
      title: 'Classification Logic',
      reset: 'Reset Defaults',
      language: 'Language',
      corePower: 'Core Power',
      strategicGoal: 'Strategic Goal',
      executionForce: 'Execution Force',
      prestigeLeverage: 'Prestige Leverage',
      xMin: 'Min Value (X)',
      yMin: 'Min Energy (Y)',
      zMin: 'Min Access (Z)',
      xMax: 'Max Value (X)',
      yMax: 'Max Energy (Y)',
      zMax: 'Max Access (Z)',
    },
    layout: {
      visualization: '3D View',
      dashboard: 'Dashboard',
      contacts: 'Contacts',
      settings: 'Settings',
      title: 'Social 3D',
    },
    dashboard: {
      title: 'Social Asset Analysis',
      totalNetwork: 'Total Network',
      connectionsManaged: 'Connections managed',
      avgValueX: 'Avg Value (X)',
      avgEnergyY: 'Avg Energy (Y)',
      avgAccessZ: 'Avg Access (Z)',
      highRelevance: 'High Relevance',
      growthPotential: 'Growth Potential',
      lowEnergy: '⚠️ Low Energy',
      strongField: 'Strong Field',
      accessibility: 'Accessibility',
      distribution: 'Distribution',
      strategicAdvice: 'Strategic Advice',
      energyDeficit: 'Energy Deficit',
      energyDeficitDesc: "Your network's average energy is low. Prioritize connecting with high-energy individuals (High Y) to boost opportunities.",
      relevanceMismatch: 'Relevance Mismatch',
      relevanceMismatchDesc: 'Many contacts have low alignment with your core goals. Consider pruning or finding more relevant peers.',
      missingCorePower: 'Missing Core Power',
      missingCorePowerDesc: 'You lack "Core Power" allies (High X, Y, Z). Cultivating these relationships is critical for stability.',
      noContacts: 'Add contacts to generate insights.',
    },
    common: {
      save: 'Save',
      delete: 'Delete',
      cancel: 'Cancel',
      edit: 'Edit',
      add: 'Add New',
    }
  },
  zh: {
    settings: {
      title: '分类逻辑',
      reset: '重置默认',
      language: '语言设置',
      corePower: '权利内核',
      strategicGoal: '战略目标',
      executionForce: '执行部队',
      prestigeLeverage: '声望杠杆',
      xMin: '最小价值 (X)',
      yMin: '最小能量 (Y)',
      zMin: '最小可达性 (Z)',
      xMax: '最大价值 (X)',
      yMax: '最大能量 (Y)',
      zMax: '最大可达性 (Z)',
    },
    layout: {
      visualization: '3D 视图',
      dashboard: '仪表盘',
      contacts: '联系人',
      settings: '设置',
      title: '人脉 3D',
    },
    dashboard: {
      title: '社会资本分析',
      totalNetwork: '人脉总数',
      connectionsManaged: '已管理连接',
      avgValueX: '平均价值 (X)',
      avgEnergyY: '平均能量 (Y)',
      avgAccessZ: '平均可达性 (Z)',
      highRelevance: '高相关性',
      growthPotential: '增长潜力',
      lowEnergy: '⚠️ 低能量警示',
      strongField: '强能量场',
      accessibility: '可达性',
      distribution: '分布情况',
      strategicAdvice: '战略建议',
      energyDeficit: '能量赤字',
      energyDeficitDesc: '你的人脉网络平均能量较低。请优先连接高能量个体（高 Y 值）以增加机会。',
      relevanceMismatch: '相关性错配',
      relevanceMismatchDesc: '许多联系人与你的核心目标一致性较低。考虑精简或寻找更相关的同伴。',
      missingCorePower: '缺失核心力量',
      missingCorePowerDesc: '你缺乏“核心力量”盟友（高 X, Y, Z）。培养这些关系对稳定性至关重要。',
      noContacts: '添加联系人以生成洞察。',
    },
    common: {
      save: '保存',
      delete: '删除',
      cancel: '取消',
      edit: '编辑',
      add: '新增',
    }
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(LANGUAGE_KEY) || 'zh'; // Default to Chinese as per request/project vibe
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let current = TRANSLATIONS[language];
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
