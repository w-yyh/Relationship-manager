import React from 'react';
import { useSettings, DEFAULT_THRESHOLDS } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { RotateCcw, Languages } from 'lucide-react';
import { CATEGORIES } from '../utils/logic';

const CATEGORY_CONFIGS = {
    CORE_POWER: [
        { key: 'xMin', label: 'settings.xMin' },
        { key: 'yMin', label: 'settings.yMin' },
        { key: 'zMin', label: 'settings.zMin' },
    ],
    STRATEGIC_GOAL: [
        { key: 'xMin', label: 'settings.xMin' },
        { key: 'yMin', label: 'settings.yMin' },
        { key: 'zMax', label: 'settings.zMax' },
    ],
    EXECUTION_FORCE: [
        { key: 'xMin', label: 'settings.xMin' },
        { key: 'zMin', label: 'settings.zMin' },
        { key: 'yMax', label: 'settings.yMax' },
    ],
    PRESTIGE_LEVERAGE: [
        { key: 'yMin', label: 'settings.yMin' },
        { key: 'xMax', label: 'settings.xMax' },
    ],
};

export function Settings() {
    const { thresholds, updateThreshold, resetSettings } = useSettings();
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'zh' : 'en');
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
                {Object.entries(CATEGORY_CONFIGS).map(([catKey, fields]) => {
                    const cat = CATEGORIES[catKey];
                    const currentSettings = thresholds[catKey];

                    return (
                        <Card key={catKey} className="border-t-4" style={{ borderTopColor: cat.color }}>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                                    {/* Ideally category names should also be translated, but using logic.js defaults for now if not in dict */}
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
                                {fields.map(field => (
                                    <div key={field.key}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-zinc-400">{t(field.label)}</span>
                                            <span className="font-mono text-blue-400">{currentSettings[field.key]}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            step="0.5"
                                            value={currentSettings[field.key]}
                                            onChange={(e) => updateThreshold(catKey, field.key, e.target.value)}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
