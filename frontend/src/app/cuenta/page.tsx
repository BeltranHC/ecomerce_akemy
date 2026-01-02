'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { usersApi, ordersApi, authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { User, Package, LogOut, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PAID: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-indigo-100 text-indigo-800',
  READY: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PREPARING: 'Preparando',
  READY: 'Listo para recoger',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export default function CuentaPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cuenta');
    }
  }, [isAuthenticated, router]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await ordersApi.getMyOrders();
      return response.data; // { data: [...], meta: {...} }
    },
    enabled: isAuthenticated,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof formData) => usersApi.updateProfile(data),
    onSuccess: (response) => {
      // Actualizar el estado local del usuario
      const updatedData = response.data;
      updateUser({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone,
      });

      // Persist contact data locally so checkout can auto-rellenar
      if (typeof window !== 'undefined') {
        const contactPayload = {
          firstName: updatedData.firstName || '',
          lastName: updatedData.lastName || '',
          email: formData.email,
          phone: updatedData.phone || '',
        };
        window.localStorage.setItem('akemy_checkout_contact', JSON.stringify(contactPayload));
      }
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Perfil actualizado correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar el perfil');
    },
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore
    }
    logout();
    router.push('/');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const orders = ordersData?.data || [];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f9f3ed] py-10">
      <div className="container-custom space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fce0d7] via-[#f6e8df] to-[#fdf8f4] border border-[#f1ded2] p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm text-[#c14444] font-semibold border border-white">
              <Sparkles className="h-4 w-4" />
              Mi Cuenta
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#3b2a2a]">
                Hola, {user?.firstName || 'Cliente'}
              </h1>
              <p className="text-[#6f5b53] text-base">Centraliza tus datos y pedidos en un solo lugar.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[#6f5b53]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-[#e8d7ca]">
                <ShieldCheck className="h-4 w-4 text-[#c14444]" />
                Tus datos rellenan el checkout automáticamente
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleLogout} className="border-[#e5c9b8] text-[#5c4a42] hover:bg-[#f4e7dd]">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 max-w-xl bg-white border border-[#ead7ca]">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-[#c14444] data-[state=active]:text-white">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-[#c14444] data-[state=active]:text-white">
              <Package className="h-4 w-4" />
              Mis Pedidos
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-[#ead7ca] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#c14444] font-semibold">Datos principales</p>
                    <h2 className="text-2xl font-bold text-[#3b2a2a]">Información personal</h2>
                    <p className="text-sm text-[#7a6a63]">Usaremos esta información para rellenar tus compras automáticamente.</p>
                  </div>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">El correo se usa para notificaciones y no es editable.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Ej. +51 999 999 999"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-[#c14444] hover:bg-[#a93a3a]"
                    >
                      {updateProfileMutation.isPending
                        ? 'Guardando...'
                        : 'Guardar y usar en checkout'}
                    </Button>
                    <span className="text-sm text-[#7a6a63]">Tus datos se guardan y se completan solos en tus siguientes compras.</span>
                  </div>
                </form>
              </div>

              <div className="bg-gradient-to-br from-white via-[#fdf7f2] to-[#f6e8df] border border-[#ead7ca] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#c14444]/10 text-[#c14444] flex items-center justify-center font-semibold">{(user?.firstName?.[0] || 'U').toUpperCase()}</div>
                  <div>
                    <p className="text-xs text-[#c14444] font-semibold">Perfil activo</p>
                    <p className="text-sm text-[#6f5b53]">Tus pedidos usarán esta información</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#5c4a42]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a6a63]">Nombre completo</span>
                    <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a6a63]">Correo</span>
                    <span className="font-semibold">{formData.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a6a63]">Teléfono</span>
                    <span className="font-semibold">{formData.phone || 'Sin registrar'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-white border border-[#ead7ca] rounded-2xl shadow-sm">
              <div className="p-6 border-b border-[#ead7ca] flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#c14444] font-semibold">Historial</p>
                  <h2 className="text-2xl font-bold text-[#3b2a2a]">Mis pedidos</h2>
                  <p className="text-sm text-[#7a6a63]">Revisa tus pedidos y su estado en tiempo real.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-[#7a6a63]">
                  <ShieldCheck className="h-4 w-4 text-[#c14444]" />
                  Correos de estado se envían al confirmar y actualizar tu pedido.
                </div>
              </div>
              {ordersLoading ? (
                <div className="p-6">
                  <p className="text-muted-foreground">Cargando pedidos...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-10 text-center space-y-4">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-[#3b2a2a]">Aún no tienes pedidos</p>
                    <p className="text-[#7a6a63]">Cuando compres, verás aquí tus pedidos y sus actualizaciones.</p>
                  </div>
                  <Button className="bg-[#c14444] hover:bg-[#a93a3a]" onClick={() => router.push('/productos')}>
                    Ver productos
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-semibold text-[#3b2a2a]">
                          #{order.orderNumber || order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="text-[#7a6a63]">
                          {new Date(order.createdAt).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status] || ''}>
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-[#3b2a2a]">{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/cuenta/pedidos/${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
