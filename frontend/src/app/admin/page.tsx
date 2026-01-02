'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingBag,
  UserPlus,
  Repeat,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboardApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { SalesChart } from '@/components/admin/charts/sales-chart';
import { OrdersStatusChart } from '@/components/admin/charts/orders-status-chart';
import { CategoryPerformanceChart } from '@/components/admin/charts/category-performance-chart';
import { ExportButtons } from '@/components/admin/export-buttons';

function TrendBadge({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const isPositive = value > 0;
  const isZero = value === 0;

  if (isZero) {
    return <span className="text-xs text-muted-foreground">Sin cambio</span>;
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'
        }`}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3 mr-1" />
      ) : (
        <TrendingDown className="h-3 w-3 mr-1" />
      )}
      {isPositive ? '+' : ''}{value}{suffix}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('month');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((res) => res.data),
  });

  const { data: salesChartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['admin-sales-chart', chartPeriod],
    queryFn: () => dashboardApi.getSalesChart(chartPeriod).then((res) => res.data),
  });

  const { data: ordersByStatus, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['admin-orders-by-status'],
    queryFn: () => dashboardApi.getOrdersByStatus().then((res) => res.data),
  });

  const { data: salesTrends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['admin-sales-trends'],
    queryFn: () => dashboardApi.getSalesTrends().then((res) => res.data),
  });

  const { data: categoryPerformance, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['admin-category-performance'],
    queryFn: () => dashboardApi.getCategoryPerformance().then((res) => res.data),
  });

  const { data: abandonedCarts, isLoading: isLoadingCarts } = useQuery({
    queryKey: ['admin-abandoned-carts'],
    queryFn: () => dashboardApi.getAbandonedCarts().then((res) => res.data),
  });

  const { data: customerMetrics, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['admin-customer-metrics'],
    queryFn: () => dashboardApi.getCustomerMetrics().then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general de tu tienda</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general de tu tienda</p>
        </div>
        <ExportButtons
          stats={stats}
          salesData={salesChartData || []}
          topProducts={stats?.topProducts || []}
          ordersByStatus={ordersByStatus || []}
        />
      </div>

      {/* Stats Cards with Trends */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas del día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(salesTrends?.daily?.sales || stats?.sales?.today?.total || 0)}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {salesTrends?.daily?.orders || stats?.sales?.today?.count || 0} pedidos
              </p>
              {salesTrends?.daily && <TrendBadge value={salesTrends.daily.change} />}
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas del mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(salesTrends?.monthly?.sales || stats?.sales?.month?.total || 0)}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                vs mes anterior
              </p>
              {salesTrends?.monthly && <TrendBadge value={salesTrends.monthly.change} />}
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overview?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">productos activos</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nuevos clientes</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesTrends?.monthly?.newCustomers || customerMetrics?.newCustomersThisMonth || 0}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">este mes</p>
              {salesTrends?.monthly && <TrendBadge value={salesTrends.monthly.customersChange} />}
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ventas</CardTitle>
              <CardDescription>Evolución de ventas por período</CardDescription>
            </div>
            <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
              <TabsList className="h-8">
                <TabsTrigger value="week" className="text-xs px-3">Semana</TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-3">Mes</TabsTrigger>
                <TabsTrigger value="year" className="text-xs px-3">Año</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesChartData || []} isLoading={isLoadingChart} />
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Estado</CardTitle>
            <CardDescription>Distribución actual</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersStatusChart data={ordersByStatus || []} isLoading={isLoadingOrders} />
          </CardContent>
        </Card>
      </div>

      {/* Category Performance and Customer Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>Rendimiento este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPerformanceChart data={categoryPerformance || []} isLoading={isLoadingCategories} />
          </CardContent>
        </Card>

        {/* Customer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Clientes</CardTitle>
            <CardDescription>Resumen de comportamiento</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCustomers ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Total Clientes</p>
                      <p className="text-xs text-muted-foreground">Registrados</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{customerMetrics?.totalCustomers || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Tasa de Conversión</p>
                      <p className="text-xs text-muted-foreground">Clientes con pedidos</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{customerMetrics?.conversionRate || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Repeat className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Clientes Recurrentes</p>
                      <p className="text-xs text-muted-foreground">Más de 1 pedido</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{customerMetrics?.repeatCustomers || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Tasa de Retención</p>
                      <p className="text-xs text-muted-foreground">Clientes que regresan</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{customerMetrics?.retentionRate || 0}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Abandoned Carts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
            Carritos Abandonados
          </CardTitle>
          <CardDescription>Carritos con productos no completados en las últimas 48 horas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCarts ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : abandonedCarts && abandonedCarts.length > 0 ? (
            <div className="space-y-3">
              {abandonedCarts.slice(0, 5).map((cart: any) => (
                <div
                  key={cart.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {cart.user?.firstName} {cart.user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{cart.user?.email}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{cart.itemCount} items</p>
                    <p className="text-xs text-muted-foreground">en carrito</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{formatPrice(cart.total)}</p>
                    <p className="text-xs text-muted-foreground">valor total</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(cart.lastActivity).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No hay carritos abandonados en las últimas 48 horas</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pedidos recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos recientes</CardTitle>
            <CardDescription>Últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <Badge
                        variant={
                          order.status === 'DELIVERED'
                            ? 'success'
                            : order.status === 'CANCELLED'
                              ? 'destructive'
                              : 'default'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay pedidos recientes
              </p>
            )}
          </CardContent>
        </Card>

        {/* Productos con bajo stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Bajo stock
            </CardTitle>
            <CardDescription>Productos que necesitan reposición</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.lowStockProducts?.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <Badge variant={product.stock === 0 ? 'destructive' : 'warning'}>
                      {product.stock} unidades
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay productos con bajo stock
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Productos más vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos más vendidos</CardTitle>
          <CardDescription>Top 5 productos con más ventas</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((product: any, index: number) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(product.price)} • SKU: {product.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.totalSold} vendidos</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay datos de ventas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
