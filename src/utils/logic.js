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

/**
 * Classify a contact based on x, y, z scores and dynamic thresholds
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {Object} thresholds - Current thresholds from SettingsContext
 * @returns {string} Category ID
 */
export function classifyContact(x, y, z, thresholds) {
  // Use default fallback if thresholds not provided (though context should provide them)
  const t = thresholds || {
    CORE_POWER: { xMin: 7, yMin: 7, zMin: 7 },
    STRATEGIC_GOAL: { xMin: 7, yMin: 7, zMax: 4 },
    EXECUTION_FORCE: { xMin: 7, zMin: 7, yMax: 5 },
    PRESTIGE_LEVERAGE: { yMin: 7, xMax: 5 },
  };

  // Helper to check standard Min threshold
  const checkMin = (val, min) => min === undefined || val >= min;
  // Helper to check standard Max threshold
  const checkMax = (val, max) => max === undefined || val <= max;

  // 1. Core Power (High X, High Y, High Z)
  if (checkMin(x, t.CORE_POWER.xMin) && checkMin(y, t.CORE_POWER.yMin) && checkMin(z, t.CORE_POWER.zMin)) {
    return CATEGORIES.CORE_POWER.id;
  }

  // 2. Strategic Goal (High X, High Y, Low Z)
  if (checkMin(x, t.STRATEGIC_GOAL.xMin) && checkMin(y, t.STRATEGIC_GOAL.yMin) && checkMax(z, t.STRATEGIC_GOAL.zMax)) {
    return CATEGORIES.STRATEGIC_GOAL.id;
  }

  // 3. Execution Force (High X, High Z, Low Y)
  if (checkMin(x, t.EXECUTION_FORCE.xMin) && checkMin(z, t.EXECUTION_FORCE.zMin) && checkMax(y, t.EXECUTION_FORCE.yMax)) {
    return CATEGORIES.EXECUTION_FORCE.id;
  }

  // 4. Prestige Leverage (High Y, Low X)
  if (checkMin(y, t.PRESTIGE_LEVERAGE.yMin) && checkMax(x, t.PRESTIGE_LEVERAGE.xMax)) {
    return CATEGORIES.PRESTIGE_LEVERAGE.id;
  }

  return CATEGORIES.OTHERS.id;
}
