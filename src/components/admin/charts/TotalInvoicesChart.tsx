// src/components/charts/TotalInvoicesChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatAxisDate } from '@/utils/dateUtils';

interface ChartData {
    name: string;
    invoices: number;
}

interface TotalInvoicesChartProps {
    data: ChartData[];
    timeRange: 'month' | 'week';
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-md border">
                <p className="font-semibold mb-2">{label}</p>
                <p className="text-sm text-[#8884d8]">
                    Invoices: <span className="font-medium">€{payload[0].value.toFixed(2)}</span>
                </p>
            </div>
        );
    }
    return null;
};

export function TotalInvoicesChart({ data, timeRange }: TotalInvoicesChartProps) {
    return (
        <div className="bg-white p-4 shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-4">Total Invoices</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="invoicesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            tickFormatter={(date) => formatAxisDate(date, timeRange)}
                            tick={{ fill: '#666' }}
                        />
                        <YAxis
                            tickFormatter={(value) => `€${value.toFixed(0)}`}
                            tick={{ fill: '#666' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Area
                            type="monotone"
                            dataKey="invoices"
                            name="Total Invoices"
                            stroke="#8884d8"
                            strokeWidth={2}
                            fill="url(#invoicesGradient)"
                            activeDot={{ r: 8 }}
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}