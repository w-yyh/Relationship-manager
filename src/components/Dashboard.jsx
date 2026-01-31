import React, { useMemo } from 'react';
import { useContacts } from '../context/ContactsContext';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { CATEGORIES } from '../utils/logic';
import { PieChart, Zap, Target, Crown, Users } from 'lucide-react';

export function Dashboard() {
    const { contacts } = useContacts();
    const { t } = useLanguage();

    const stats = useMemo(() => {
        const total = contacts.length;
        const categoryCounts = {};
        Object.keys(CATEGORIES).forEach(k => categoryCounts[k] = 0);

        let totalX = 0, totalY = 0, totalZ = 0;

        contacts.forEach(c => {
            // Find category key from category ID
            const catKey = Object.keys(CATEGORIES).find(k => CATEGORIES[k].id === c.category);
            if (catKey) categoryCounts[catKey]++;

            totalX += Number(c.x);
            totalY += Number(c.y);
            totalZ += Number(c.z);
        });

        return {
            total,
            categoryCounts,
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
