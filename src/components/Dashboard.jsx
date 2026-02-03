import React, { useMemo } from 'react';
import { useContacts } from '../context/ContactsContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { CATEGORIES } from '../utils/logic';
import { TAG_CATEGORIES, getTagById } from '../utils/tags';
import { PieChart, Zap, Target, Crown, Users, HeartPulse } from 'lucide-react';

export function Dashboard() {
    const { contacts } = useContacts();
    const { t } = useLanguage();

    const stats = useMemo(() => {
        const total = contacts.length;
        const categoryCounts = {};
        Object.keys(CATEGORIES).forEach(k => categoryCounts[k] = 0);

        let totalX = 0, totalY = 0, totalZ = 0;
        
        // Tag Stats
        const tagCounts = { EXTERNAL: 0, INTERNAL: 0 };
        const specificTagCounts = {};
        
        contacts.forEach(c => {
            // Find category key from category ID
            const catKey = Object.keys(CATEGORIES).find(k => CATEGORIES[k].id === c.category);
            if (catKey) categoryCounts[catKey]++;

            totalX += Number(c.x);
            totalY += Number(c.y);
            totalZ += Number(c.z);
            
            // Process Tags
            if (c.tags && Array.isArray(c.tags)) {
                c.tags.forEach(tagId => {
                    specificTagCounts[tagId] = (specificTagCounts[tagId] || 0) + 1;
                    const tagInfo = getTagById(tagId);
                    if (tagInfo) {
                        tagCounts[tagInfo.categoryId]++;
                    }
                });
            }
        });

        // Generate Analysis Suggestions
        const suggestions = [];
        
        // Structural Analysis
        if (!specificTagCounts['growth_engine'] && !specificTagCounts['wisdom_ally']) {
            suggestions.push({
                type: 'warning',
                title: '缺乏长期成长动力',
                desc: '当前网络中缺乏“成长引擎”或“智慧同盟”，建议寻找导师类人脉或跨界合作机会。'
            });
        }
        
        const totalTags = tagCounts.EXTERNAL + tagCounts.INTERNAL;
        if (totalTags > 0 && (tagCounts.EXTERNAL / totalTags) < 0.3) {
            suggestions.push({
                type: 'info',
                title: '信息源可能单一',
                desc: '外部协作网络占比过低，建议拓展专业资源池或信息交换站，避免回音室效应。'
            });
        }
        
        // Combined XYZ Analysis
        // Find contacts tagged as 'value_foundation' (Value Cornerstone) but with low Z (Accessibility)
        const inaccessibleCornerstones = contacts.filter(c => 
            c.tags && c.tags.includes('value_foundation') && Number(c.z) < 4
        );
        
        if (inaccessibleCornerstones.length > 0) {
            suggestions.push({
                type: 'critical',
                title: '核心链接不稳',
                desc: `发现 ${inaccessibleCornerstones.length} 位“价值基石”触达性较低(Z轴不足)。需优先提高连接频次，减少中间环节。`
            });
        }

        return {
            total,
            categoryCounts,
            tagCounts,
            suggestions,
            avgX: total ? (totalX / total).toFixed(1) : 0,
            avgY: total ? (totalY / total).toFixed(1) : 0,
            avgZ: total ? (totalZ / total).toFixed(1) : 0,
        };
    }, [contacts]);

    return (
        <div className="p-6 space-y-6 overflow-y-auto h-full">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {t('dashboard.title')}
            </h2>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={t('dashboard.totalNetwork')}
                    value={stats.total}
                    icon={Users}
                    subtitle={t('dashboard.connectionsManaged')}
                />
                <StatCard
                    title={t('dashboard.avgValueX')}
                    value={stats.avgX}
                    icon={Target}
                    color="text-blue-400"
                    subtitle={stats.avgX > 7 ? t('dashboard.highRelevance') : t('dashboard.growthPotential')}
                />
                <StatCard
                    title={t('dashboard.avgEnergyY')}
                    value={stats.avgY}
                    icon={Zap}
                    color="text-yellow-400"
                    subtitle={stats.avgY < 5 ? t('dashboard.lowEnergy') : t('dashboard.strongField')}
                />
                <StatCard
                    title={t('dashboard.avgAccessZ')}
                    value={stats.avgZ}
                    icon={Crown}
                    color="text-green-400"
                    subtitle={t('dashboard.accessibility')}
                />
            </div>

            {/* Network Health Analysis */}
            <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HeartPulse className="text-purple-400" />
                        人际网络健康度 (Network Health)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Distribution Bar */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-zinc-400">价值投资分布</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: TAG_CATEGORIES.EXTERNAL.color }}>{TAG_CATEGORIES.EXTERNAL.label}</span>
                                    <span style={{ color: TAG_CATEGORIES.INTERNAL.color }}>{TAG_CATEGORIES.INTERNAL.label}</span>
                                </div>
                                <div className="h-4 bg-zinc-800 rounded-full overflow-hidden flex">
                                    <div 
                                        className="h-full transition-all duration-500"
                                        style={{ 
                                            width: `${stats.tagCounts.EXTERNAL + stats.tagCounts.INTERNAL > 0 
                                                ? (stats.tagCounts.EXTERNAL / (stats.tagCounts.EXTERNAL + stats.tagCounts.INTERNAL)) * 100 
                                                : 50}%`,
                                            background: TAG_CATEGORIES.EXTERNAL.color 
                                        }}
                                    />
                                    <div 
                                        className="h-full flex-1 transition-all duration-500"
                                        style={{ background: TAG_CATEGORIES.INTERNAL.color }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>{stats.tagCounts.EXTERNAL} connections</span>
                                    <span>{stats.tagCounts.INTERNAL} connections</span>
                                </div>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-zinc-400">智能诊断</h4>
                            {stats.suggestions.length > 0 ? (
                                stats.suggestions.map((s, i) => (
                                    <div key={i} className={`text-sm p-3 rounded border bg-opacity-10 ${
                                        s.type === 'warning' ? 'bg-yellow-500 border-yellow-500/30 text-yellow-200' :
                                        s.type === 'critical' ? 'bg-red-500 border-red-500/30 text-red-200' :
                                        'bg-blue-500 border-blue-500/30 text-blue-200'
                                    }`}>
                                        <div className="font-bold mb-1">{s.title}</div>
                                        <div className="opacity-90 text-xs">{s.desc}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-zinc-500 italic p-2 border border-dashed border-zinc-800 rounded">
                                    当前网络结构健康，暂无预警。
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Category Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>{t('dashboard.distribution')}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {Object.keys(CATEGORIES).map(key => {
                            const cat = CATEGORIES[key];
                            const count = stats.categoryCounts[key] || 0;
                            const percent = stats.total ? Math.round((count / stats.total) * 100) : 0;

                            return (
                                <div key={key} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                                            {/* Ideally translate category label here too if needed, but keeping cat.label for now */}
                                            {cat.label}
                                        </span>
                                        <span className="text-zinc-400">{count} ({percent}%)</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${percent}%`, background: cat.color }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-500">{cat.desc}</p>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>{t('dashboard.strategicAdvice')}</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm text-zinc-300">
                            {stats.avgY < 5 && (
                                <AlertBox title={t('dashboard.energyDeficit')}>
                                    {t('dashboard.energyDeficitDesc')}
                                </AlertBox>
                            )}
                            {stats.avgX < 5 && (
                                <AlertBox title={t('dashboard.relevanceMismatch')}>
                                    {t('dashboard.relevanceMismatchDesc')}
                                </AlertBox>
                            )}
                            {stats.categoryCounts['CORE_POWER'] === 0 && (
                                <AlertBox title={t('dashboard.missingCorePower')} color="bg-red-500/10 border-red-500/20 text-red-200">
                                    {t('dashboard.missingCorePowerDesc')}
                                </AlertBox>
                            )}
                            {stats.total === 0 && <div className="text-center p-8 text-zinc-500">{t('dashboard.noContacts')}</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, subtitle, color = "text-white" }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-zinc-400">{title}</p>
                        <div className="text-3xl font-bold mt-2">{value}</div>
                    </div>
                    <div className={`p-2 bg-zinc-800 rounded-lg ${color}`}>
                        <Icon size={20} />
                    </div>
                </div>
                {subtitle && <p className="text-xs text-zinc-500 mt-2">{subtitle}</p>}
            </CardContent>
        </Card>
    );
}

function AlertBox({ title, children, color = "bg-blue-500/10 border-blue-500/20 text-blue-200" }) {
    return (
        <div className={`p-3 rounded-lg border ${color}`}>
            <h4 className="font-semibold mb-1">{title}</h4>
            <p className="opacity-80 leading-relaxed text-xs">{children}</p>
        </div>
    );
}
