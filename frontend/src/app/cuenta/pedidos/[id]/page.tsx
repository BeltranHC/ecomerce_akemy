'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, XCircle, MapPin, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, getImageUrl } from '@/lib/utils';
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

const paymentMethodLabels: Record<string, string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  YAPE: 'Yape',
  PLIN: 'Plin',
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/cuenta/pedidos');
    }
  }, [isAuthenticated, authLoading, router]);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await ordersApi.getById(orderId);
      return response.data;
    },
    enabled: isAuthenticated && !!orderId,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container-custom py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-custom py-8">
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Pedido no encontrado</h2>
          <p className="text-muted-foreground mb-6">
            El pedido que buscas no existe o no tienes acceso a él
          </p>
          <Link href="/cuenta/pedidos">
            <Button className="gradient-primary">
              Ver mis pedidos
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const orderDate = new Date(order.createdAt).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/cuenta/pedidos')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold">
                Pedido #{order.orderNumber}
              </h1>
              <p className="text-muted-foreground">{orderDate}</p>
            </div>
            <Badge className={`${status.color} flex items-center gap-1 w-fit text-sm px-3 py-1`}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={getImageUrl(item.product?.images?.[0]?.url)}
                      alt={item.product?.name || item.productName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-2">
                      {item.product?.name || item.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-primary mt-1">
                      {formatPrice(item.price)} c/u
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-muted-foreground">Tel: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal || order.total)}</span>
              </div>
              {order.shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="gradient-text">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
              </p>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                Estado: {order.paymentStatus === 'PAID' ? 'Pagado' : order.paymentStatus === 'PENDING' ? 'Pendiente' : order.paymentStatus}
              </p>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          <Link href="/cuenta/pedidos">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a mis pedidos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
