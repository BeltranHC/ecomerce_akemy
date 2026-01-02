'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

interface CategoryPerformanceChartProps {
    data: Array<{ id: string; name: string; totalSales: number; itemsSold: number }>;
    isLoading?: boolean;
}

export function CategoryPerformanceChart({ data, isLoading }: CategoryPerformanceChartProps) {
    if (isLoading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No hay datos de ventas por categoría
            </div>
        );
    }

    // Tomar solo las top 8 categorías
    const chartData = data.slice(0, 8);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis
                    type="number"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `S/${value}`}
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number, name: string) => {
                        if (name === 'totalSales') return [formatPrice(value), 'Ventas'];
                        return [value, 'Items vendidos'];
                    }}
                />
                <Bar
                    dataKey="totalSales"
                    fill="#8b5cf6"
                    radius={[0, 4, 4, 0]}
                    name="totalSales"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
