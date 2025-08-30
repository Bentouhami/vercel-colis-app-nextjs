// src/components/charts/DashboardCharts.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { RevenueChart } from './RevenueChart';
import { CustomerGrowthChart } from './CustomerGrowthChart';
import { TotalInvoicesChart } from './TotalInvoicesChart';
import { API_DOMAIN } from "@/utils/constants";

interface DailyData {
    [date: string]: {
        totalAmount?: number;
        totalTtcAmount?: number;
        totalCustomers?: number;
    };
}

const DashboardCharts = () => {
    const [dailyData, setDailyData] = useState<DailyData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [timeRange, setTimeRange] = useState<'month' | 'week'>('month');

    useEffect(() => {
        const fetchData = async () => {
            setIsClient(true);
            try {
                const endpoint = timeRange === 'month' ? 'monthly-summary' : 'weekly-summary';
                const response = await fetch(`${API_DOMAIN}/dashboard/${endpoint}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: DailyData = await response.json();
                setDailyData(data);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [timeRange]);

    if (!isClient) return null;
    if (error) return <div className="text-red-500 font-bold">Error: {error}</div>;
    if (!dailyData) return <div className="text-gray-500 font-bold">Loading...</div>;

    const chartData = Object.entries(dailyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
            name: date,
            invoices: Number(data?.totalAmount?.toFixed(2)) || 0,
            revenue: Number(data?.totalTtcAmount?.toFixed(2)) || 0,
            customers: data?.totalCustomers || 0,
        }));

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as 'month' | 'week')}
                    className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="month">Mois</option>
                    <option value="week">Semaine</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TotalInvoicesChart data={chartData} timeRange={timeRange} />
                <RevenueChart data={chartData} timeRange={timeRange} />
                <CustomerGrowthChart data={chartData} timeRange={timeRange} />
            </div>
        </div>
    );
};

export default DashboardCharts;
