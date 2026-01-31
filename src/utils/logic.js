/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} name
 * @property {number} x - Value Relevance (0-10)
 * @property {number} y - Energy Level (0-10)
 * @property {number} z - Accessibility (0-10)
 * @property {string} note
 * @property {string} category
 */

export const CATEGORIES = {
  CORE_POWER: {
    id: 'CORE_POWER',
    label: '权利内核',
    color: '#ef4444', // red-500
    desc: '不计成本维护',
  },
  STRATEGIC_GOAL: {
    id: 'STRATEGIC_GOAL',
    label: '战略目标',
    color: '#eab308', // yellow-500
    desc: '布局的核心，设法连接',
  },
  PRESTIGE_LEVERAGE: {
    id: 'PRESTIGE_LEVERAGE',
    label: '声望杠杆',
    color: '#a855f7', // purple-500
    desc: '保持连接，提升被见度',
  },
  EXECUTION_FORCE: {
    id: 'EXECUTION_FORCE',
    label: '执行部队',
    color: '#3b82f6', // blue-500
    desc: '充分授权，共赢潜力',
  },
  OTHERS: {
    id: 'OTHERS',
    label: '普通连接',
    color: '#9ca3af', // gray-400
    desc: '维持基本关系',
  }
};

export const PRIORITY_ORDER = [
  'CORE_POWER',
  'STRATEGIC_GOAL',
  'EXECUTION_FORCE',
  'PRESTIGE_LEVERAGE'
];

export const RULE_TYPES = [
  { key: 'xMin', label: 'Min Value (X)', axis: 'x', type: 'min' },
  { key: 'xMax', label: 'Max Value (X)', axis: 'x', type: 'max' },
  { key: 'yMin', label: 'Min Energy (Y)', axis: 'y', type: 'min' },
  { key: 'yMax', label: 'Max Energy (Y)', axis: 'y', type: 'max' },
  { key: 'zMin', label: 'Min Access (Z)', axis: 'z', type: 'min' },
  { key: 'zMax', label: 'Max Access (Z)', axis: 'z', type: 'max' },
];

/**
 * Classify a contact based on x, y, z scores and dynamic thresholds
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {Object} thresholds - Current thresholds from SettingsContext
 * @returns {string} Category ID
 */
export function classifyContact(x, y, z, thresholds) {
  if (!thresholds) return CATEGORIES.OTHERS.id;

  for (const catId of PRIORITY_ORDER) {
    const rules = thresholds[catId];
    if (!rules) continue;

    const pass = Object.entries(rules).every(([key, val]) => {
      const value = Number(val);
      switch (key) {
        case 'xMin': return x >= value;
        case 'xMax': return x <= value;
        case 'yMin': return y >= value;
        case 'yMax': return y <= value;
        case 'zMin': return z >= value;
        case 'zMax': return z <= value;
        default: return true; // Ignore unknown keys
      }
    });

    if (pass) return catId;
  }

  return CATEGORIES.OTHERS.id;
}
