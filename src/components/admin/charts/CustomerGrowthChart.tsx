// src/components/charts/CustomerGrowthChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {formatAxisDate} from "@/utils/dateUtils";

interface ChartData {
    name: string;
    customers: number;
}

interface CustomerGrowthChartProps {
    data: ChartData[];
    timeRange: 'month' | 'week';
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-md border">
                <p className="font-semibold mb-2">{label}</p>
                <p className="text-sm text-[#ffc658]">
                    Customers: <span className="font-medium">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

export function CustomerGrowthChart({ data, timeRange }: CustomerGrowthChartProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-4">Customer Growth</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            tickFormatter={(date) => formatAxisDate(date, timeRange)}
                            tick={{ fill: '#666' }}
                        />
                        <YAxis tick={{ fill: '#666' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Area
                            type="monotone"
                            dataKey="customers"
                            name="Customer Growth"
                            stroke="#ffc658"
                            strokeWidth={2}
                            fill="url(#customerGradient)"
                            activeDot={{ r: 8 }}
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}