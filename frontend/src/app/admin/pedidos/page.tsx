'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Eye,
  MoreHorizontal,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  PackageCheck,
  CreditCard,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
  PENDING: { label: 'Pendiente', variant: 'secondary', icon: Clock },
  PAID: { label: 'Pagado', variant: 'default', icon: CreditCard },
  PREPARING: { label: 'Preparando', variant: 'outline', icon: Package },
  READY: { label: 'Listo para recoger', variant: 'default', icon: PackageCheck },
  DELIVERED: { label: 'Entregado', variant: 'default', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', variant: 'destructive', icon: XCircle },
};

export default function PedidosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: async () => {
      const response = await ordersApi.getAll({
        page,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      return response.data; // { data: [...], meta: {...} }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar el estado');
    },
  });

  const orders = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const filteredOrders = orders.filter((order: any) =>
    order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    order.user?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground">
          Gestiona los pedidos de tu tienda
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por # pedido o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="PAID">Pagado</SelectItem>
            <SelectItem value="PREPARING">Preparando</SelectItem>
            <SelectItem value="READY">Listo para recoger</SelectItem>
            <SelectItem value="DELIVERED">Entregado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead># Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">No hay pedidos</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order: any) => {
                const status = statusConfig[order.status] || statusConfig.PENDING;
                const StatusIcon = status.icon;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.createdAt &&
                        format(new Date(order.createdAt), "d 'de' MMM, yyyy", {
                          locale: es,
                        })}
                    </TableCell>
                    <TableCell className="font-medium">
                      S/ {Number(order.total || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: 'PAID',
                              })
                            }
                            disabled={order.status === 'PAID' || order.status === 'CANCELLED'}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Marcar como pagado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: 'PREPARING',
                              })
                            }
                            disabled={order.status === 'CANCELLED'}
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Marcar como preparando
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: 'READY',
                              })
                            }
                            disabled={order.status === 'CANCELLED'}
                            className="text-green-600"
                          >
                            <Bell className="mr-2 h-4 w-4" />
                            Listo para recoger (notificar)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: 'DELIVERED',
                              })
                            }
                            disabled={order.status === 'CANCELLED'}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Marcar como entregado
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: 'CANCELLED',
                              })
                            }
                            disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar pedido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Cliente</h4>
                  <p>{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Fecha</h4>
                  <p>
                    {selectedOrder.createdAt &&
                      format(new Date(selectedOrder.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", {
                        locale: es,
                      })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium mb-2">Productos</h4>
                <div className="border rounded-lg divide-y">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product?.name || 'Producto'}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">S/ {(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">S/ {Number(selectedOrder.total || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
