import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

export interface KpiCardProps {
    title?: string;
    label?: string; // Alias for backward compatibility
    value: string | number;
    color: string;
    icon: LucideIcon;
    description?: string;
    subLabel?: string; // Alias for backward compatibility
    trendData?: { value: number }[];
}

const KpiCard: React.FC<KpiCardProps> = ({ 
    title, 
    label, 
    value, 
    color, 
    icon: IconComponent, 
    description, 
    subLabel,
    trendData
}) => {
    const displayTitle = title || label || '';
    const displayDescription = description || subLabel;
    // Helper to add alpha to hex color
    const getAlphaColor = (hex: string, alpha: string) => {
        if (hex.startsWith('#')) {
            return `${hex}${alpha}`;
        }
        return hex;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100/80 relative overflow-hidden group h-full transition-all duration-300 flex flex-col justify-between">
            {/* Watermark Icon */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.05] transform rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none z-0">
                <IconComponent size={100} style={{ color }} />
            </div>

            <div className="relative z-10 flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* KPI Title */}
                    <p className="sys-kpi-label opacity-90 truncate font-bold text-xs text-gray-500 uppercase tracking-wider">
                        {displayTitle}
                    </p>
                    
                    {/* KPI Value */}
                    <div className="flex items-baseline gap-2 mt-1">
                        <h4 className="sys-kpi-value truncate text-3xl font-black" style={{ color }}>
                            {value}
                        </h4>
                    </div>
                </div>

                {/* Main Icon Box */}
                <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white transition-transform duration-300 group-hover:rotate-6" 
                    style={{ backgroundColor: getAlphaColor(color, '30') }} // 20% Opacity (Hex 33)
                >
                    <IconComponent size={22} style={{ color }} />
                </div>
            </div>

            {/* Sparkline Chart */}
            {trendData && trendData.length > 0 && (
                <div className="h-10 w-full mt-2 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <YAxis domain={['auto', 'auto']} hide />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={color} 
                                strokeWidth={3} 
                                dot={false}
                                isAnimationActive={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* KPI Description */}
            {displayDescription && (
                <p className="sys-kpi-desc flex items-center gap-1.5 truncate mt-3 z-10 relative text-xs font-semibold text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                    {displayDescription}
                </p>
            )}
        </div>
    );
};

export default KpiCard;

