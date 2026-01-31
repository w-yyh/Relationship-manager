import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { RotateCcw, Languages, Plus, Trash2 } from 'lucide-react';
import { CATEGORIES, RULE_TYPES, PRIORITY_ORDER } from '../utils/logic';

export function Settings() {
    const { thresholds, updateThreshold, addRule, removeRule, resetSettings } = useSettings();
    const { language, setLanguage, t } = useLanguage();

    // Local state to track selected new rule for each category
    // { 'CORE_POWER': 'xMin', ... }
    const [newRuleSelection, setNewRuleSelection] = useState({});

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'zh' : 'en');
    };

    const handleAddRule = (catKey) => {
        const ruleKey = newRuleSelection[catKey];
        if (!ruleKey) return;
        
        // Default value for new rule
        addRule(catKey, ruleKey, 5);
        
        // Reset selection
        setNewRuleSelection(prev => ({ ...prev, [catKey]: '' }));
    };

    return (
        <div className="p-6 h-full overflow-y-auto max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">{t('settings.title')}</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={toggleLanguage} size="sm">
                        <Languages size={16} className="mr-2" />
                        {language === 'en' ? '中文' : 'English'}
                    </Button>
                    <Button variant="secondary" onClick={resetSettings} size="sm">
                        <RotateCcw size={16} className="mr-2" /> {t('settings.reset')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PRIORITY_ORDER.map((catKey) => {
                    const cat = CATEGORIES[catKey];
                    const currentSettings = thresholds[catKey] || {};
                    const currentKeys = Object.keys(currentSettings);

                    // Filter available rules to exclude already added ones
                    const availableRules = RULE_TYPES.filter(rt => !currentKeys.includes(rt.key));

                    return (
                        <Card key={catKey} className="border-t-4" style={{ borderTopColor: cat.color }}>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                                    {t(`settings.${
                                        catKey === 'CORE_POWER' ? 'corePower' : 
                                        catKey === 'STRATEGIC_GOAL' ? 'strategicGoal' :
                                        catKey === 'EXECUTION_FORCE' ? 'executionForce' :
                                        catKey === 'PRESTIGE_LEVERAGE' ? 'prestigeLeverage' : 'others'
                                    }`) || cat.label}
                                </CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">{cat.desc}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* List existing rules */}
                                {currentKeys.map(key => {
                                    const ruleDef = RULE_TYPES.find(r => r.key === key);
                                    // Fallback label if ruleDef not found (shouldn't happen)
                                    const label = ruleDef ? t(`settings.${key}`) : key;
                                    
                                    return (
                                        <div key={key} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-zinc-300 font-medium">{label}</span>
                                                <button 
                                                    onClick={() => removeRule(catKey, key)}
                                                    className="text-zinc-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="10"
                                                    step="0.5"
                                                    value={currentSettings[key]}
                                                    onChange={(e) => updateThreshold(catKey, key, e.target.value)}
                                                    className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                />
                                                <span className="font-mono text-blue-400 w-8 text-right">{currentSettings[key]}</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add New Rule UI */}
                                {availableRules.length > 0 && (
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
                                        <select
                                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                                            value={newRuleSelection[catKey] || ''}
                                            onChange={(e) => setNewRuleSelection(prev => ({ ...prev, [catKey]: e.target.value }))}
                                        >
                                            <option value="">{t('settings.selectRule')}...</option>
                                            {availableRules.map(rt => (
                                                <option key={rt.key} value={rt.key}>
                                                    {t(`settings.${rt.key}`)}
                                                </option>
                                            ))}
                                        </select>
                                        <Button 
                                            size="sm" 
                                            variant="secondary"
                                            disabled={!newRuleSelection[catKey]}
                                            onClick={() => handleAddRule(catKey)}
                                        >
                                            <Plus size={14} className="mr-1" /> {t('settings.add')}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}