'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft, Eye, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import { ordersApi } from '@/lib/api';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { 
    label: 'Pendiente', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="h-4 w-4" />
  },
  PAID: { 
    label: 'Pagado', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle className="h-4 w-4" />
  },
  PREPARING: { 
    label: 'Preparando', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Package className="h-4 w-4" />
  },
  SHIPPED: { 
    label: 'Enviado', 
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: <Truck className="h-4 w-4" />
  },
  DELIVERED: { 
    label: 'Entregado', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="h-4 w-4" />
  },
  CANCELLED: { 
    label: 'Cancelado', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="h-4 w-4" />
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/cuenta/pedidos');
    }
  }, [isAuthenticated, authLoading, router]);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await ordersApi.getMyOrders();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const orders = ordersData?.data || ordersData || [];

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container-custom py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Mis Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Historial de tus compras
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tienes pedidos aún</h2>
          <p className="text-muted-foreground mb-6">
            Explora nuestros productos y realiza tu primera compra
          </p>
          <Link href="/productos">
            <Button className="gradient-primary">
              Ver Productos
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            const orderDate = new Date(order.createdAt).toLocaleDateString('es-PE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{orderDate}</p>
                    </div>
                    <Badge className={`${status.color} flex items-center gap-1 w-fit`}>
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {order.items?.length || order._count?.items || 0} producto(s)
                      </p>
                      <p className="text-xl font-bold gradient-text">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <Link href={`/cuenta/pedidos/${order.id}`}>
                      <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>

                  {/* Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item: any) => (
                          <div key={item.id} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                            <span className="text-sm font-medium truncate max-w-[150px]">
                              {item.product?.name || item.productName}
                            </span>
                            <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center bg-muted/50 rounded-lg px-3 py-2">
                            <span className="text-sm text-muted-foreground">
                              +{order.items.length - 3} más
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
