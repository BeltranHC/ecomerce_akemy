'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OrdersStatusChartProps {
    data: Array<{ status: string; count: number }>;
    isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: '#f59e0b',
    PAID: '#10b981',
    PREPARING: '#3b82f6',
    READY: '#8b5cf6',
    DELIVERED: '#22c55e',
    CANCELLED: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pendientes',
    PAID: 'Pagados',
    PREPARING: 'Preparando',
    READY: 'Listos',
    DELIVERED: 'Entregados',
    CANCELLED: 'Cancelados',
};

export function OrdersStatusChart({ data, isLoading }: OrdersStatusChartProps) {
    if (isLoading) {
        return (
            <div className="h-[250px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No hay datos de pedidos
            </div>
        );
    }

    const chartData = data.map((item) => ({
        name: STATUS_LABELS[item.status] || item.status,
        value: item.count,
        color: STATUS_COLORS[item.status] || '#9ca3af',
    }));

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                />
                <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    formatter={(value) => (
                        <span className="text-sm text-gray-600">{value}</span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
