'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, MapPin, CreditCard, Store, ArrowLeft, CheckCircle, Loader2, Banknote, Building2, Smartphone, Wallet, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore, useAuthStore } from '@/lib/store';
import { cartApi, ordersApi, settingsApi, paymentsApi } from '@/lib/api';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setCart, clearCart, getOrCreateSessionId } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  // Cargar configuración de pagos (endpoint público)
  const { data: paymentConfig } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: async () => {
      const response = await settingsApi.getPublic();
      const settingsMap = response.data || {};
      return {
        // Yape
        yapeEnabled: settingsMap.yapeEnabled !== 'false',
        yapePhone: settingsMap.yapePhone || '999-888-777',
        yapeName: settingsMap.yapeName || 'AKEMY',
        // Bank Transfer
        transferEnabled: settingsMap.transferEnabled !== 'false',
        bankName: settingsMap.bankName || 'BCP',
        bankAccountNumber: settingsMap.bankAccountNumber || '191-12345678-0-12',
        bankCCI: settingsMap.bankCCI || '00219100123456780012',
        bankAccountHolder: settingsMap.bankAccountHolder || 'AKEMY SAC',
        // PayPal
        paypalEnabled: settingsMap.paypalEnabled !== 'false',
        paypalEmail: settingsMap.paypalEmail || 'ventas@akemy.com',
        // Card
        cardEnabled: settingsMap.cardEnabled === 'true',
        // Cash
        cashEnabled: settingsMap.cashEnabled !== 'false',
        // Store info
        storeEmail: settingsMap.storeEmail || 'ventas@akemy.com',
        storePhone: settingsMap.storePhone || '',
        // Pickup info
        pickupAddress: settingsMap.pickupAddress || 'Av. Principal 123, Lima',
        pickupSchedule: settingsMap.pickupSchedule || 'Lun - Sáb: 9:00 AM - 7:00 PM',
        pickupPhone: settingsMap.pickupPhone || settingsMap.storePhone || '',
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupDate: '',
    pickupTime: '',
    notes: '',
    paymentMethod: 'cash',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  // Prefill contacto desde el perfil guardado para evitar volver a escribirlo
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('akemy_checkout_contact');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          firstName: parsed.firstName || prev.firstName,
          lastName: parsed.lastName || prev.lastName,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
        }));
      } catch (error) {
        console.warn('No se pudo hidratar datos de checkout almacenados', error);
      }
    }
  }, []);

  // Actualizar método de pago por defecto basado en configuración
  useEffect(() => {
    if (paymentConfig) {
      if (formData.paymentMethod === 'cash' && paymentConfig.cashEnabled) return;
      if (formData.paymentMethod === 'card' && paymentConfig.cardEnabled) return;

      if (paymentConfig.cashEnabled) {
        setFormData(prev => ({ ...prev, paymentMethod: 'cash' }));
      } else if (paymentConfig.cardEnabled) {
        setFormData(prev => ({ ...prev, paymentMethod: 'card' }));
      }
    }
  }, [paymentConfig]);

  useEffect(() => {
    // Cargar datos del usuario si está autenticado
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Mantener sincronizado el contacto para auto-rellenar futuras compras
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (formData.firstName && formData.lastName && formData.email && formData.phone) {
      window.localStorage.setItem('akemy_checkout_contact', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      }));
    }
  }, [formData.firstName, formData.lastName, formData.email, formData.phone]);

  useEffect(() => {
    // Cargar carrito solo una vez al montar el componente
    const loadCart = async () => {
      try {
        // Si está autenticado, el token se enviará automáticamente
        // Si no, usamos sessionId
        const sessionId = isAuthenticated ? undefined : getOrCreateSessionId();
        const response = await cartApi.get(sessionId);
        if (response.data) {
          setCart(response.data);
        }
      } catch (error: any) {
        // Ignorar errores silenciosamente - el usuario verá "carrito vacío"
        console.log('Cart not loaded:', error?.response?.status);
      }
    };

    // Solo cargar si no hay carrito
    if (!cart || !cart.items) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar una compra');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    // Validar campos requeridos
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: 'Recojo en tienda',
          city: 'Lima',
          district: 'Tienda AKEMY',
        },
        useCart: true, // Usar los items del carrito
        notes: formData.notes ? `Fecha de recojo: ${formData.pickupDate || 'Por confirmar'} - Hora: ${formData.pickupTime || 'Por confirmar'}. ${formData.notes}` : `Fecha de recojo: ${formData.pickupDate || 'Por confirmar'} - Hora: ${formData.pickupTime || 'Por confirmar'}`,
        paymentMethod: formData.paymentMethod,
        shippingCost: 0,
      };

      const response = await ordersApi.create(orderData);
      const createdOrderId = response.data.id;

      // Si es pago con tarjeta (Mercado Pago), redirigir al checkout de MP
      if (formData.paymentMethod === 'card' || formData.paymentMethod === 'mercadopago') {
        try {
          const mpResponse = await paymentsApi.createPreference(createdOrderId);
          clearCart();
          // Redirigir a Mercado Pago
          window.location.href = mpResponse.data.init_point;
          return;
        } catch (mpError: any) {
          console.error('Error con Mercado Pago:', mpError);
          toast.error('Error al conectar con Mercado Pago. Intenta otro método de pago.');
          setIsLoading(false);
          return;
        }
      }

      // Para otros métodos de pago, mostrar pantalla de éxito
      setOrderNumber(response.data.orderNumber);
      setOrderId(createdOrderId);
      setOrderCreated(true);
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito
  if (orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
            <p className="text-muted-foreground mb-6">
              Tu pedido ha sido procesado exitosamente. Recibirás un correo electrónico con los detalles de tu pedido.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-muted-foreground">Número de pedido</p>
              <p className="text-2xl font-bold text-primary">{orderNumber}</p>
              {orderId && user?.role === 'ADMIN' && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        setIsMarkingPaid(true);
                        await ordersApi.markAsPaid(orderId);
                        toast.success('Pedido marcado como pagado');
                      } catch (err: any) {
                        toast.error(err?.response?.data?.message || 'No se pudo marcar como pagado');
                      } finally {
                        setIsMarkingPaid(false);
                      }
                    }}
                    disabled={isMarkingPaid}
                  >
                    {isMarkingPaid ? 'Marcando...' : 'Marcar como pagado'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Solo visible para admin (endpoint /orders/:id/pay)
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/cuenta/pedidos">Ver mis pedidos</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/productos">Seguir comprando</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Validar que haya productos en el carrito
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">
              Añade productos a tu carrito para continuar con la compra
            </p>
            <Button asChild>
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.subtotal || cart.total || 0;
  const total = subtotal; // Sin costo de envío - solo recojo en tienda

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link href="/productos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </Link>
          <h1 className="text-3xl font-bold">Finalizar compra</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos personales */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Datos de contacto
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+51 999 999 999"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Recojo en tienda */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-primary" />
                  Recojo en tienda
                </h2>

                {/* Info de la tienda */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Tienda AKEMY</p>
                      <p className="text-sm text-muted-foreground">{paymentConfig?.pickupAddress || 'Av. Principal 123, Lima'}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {paymentConfig?.pickupSchedule || 'Lun - Sáb: 9:00 AM - 7:00 PM'}
                      </p>
                      {paymentConfig?.pickupPhone && (
                        <p className="text-sm text-muted-foreground mt-1">
                          📞 {paymentConfig.pickupPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha preferida de recojo
                      </Label>
                      <Input
                        id="pickupDate"
                        name="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupTime" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Hora preferida
                      </Label>
                      <select
                        id="pickupTime"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                      >
                        <option value="">Seleccionar hora</option>
                        <option value="09:00 - 10:00">09:00 - 10:00 AM</option>
                        <option value="10:00 - 11:00">10:00 - 11:00 AM</option>
                        <option value="11:00 - 12:00">11:00 - 12:00 PM</option>
                        <option value="12:00 - 13:00">12:00 - 01:00 PM</option>
                        <option value="13:00 - 14:00">01:00 - 02:00 PM</option>
                        <option value="14:00 - 15:00">02:00 - 03:00 PM</option>
                        <option value="15:00 - 16:00">03:00 - 04:00 PM</option>
                        <option value="16:00 - 17:00">04:00 - 05:00 PM</option>
                        <option value="17:00 - 18:00">05:00 - 06:00 PM</option>
                        <option value="18:00 - 19:00">06:00 - 07:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>Nota:</strong> Te contactaremos para confirmar la disponibilidad de tu pedido y la fecha/hora de recojo.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas adicionales</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                      rows={2}
                      placeholder="¿Alguna indicación especial?"
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Método de pago
                </h2>

                <div className="space-y-3">
                  {/* Pago contra entrega */}
                  {paymentConfig?.cashEnabled && (
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'cash' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Banknote className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Pago contra entrega</p>
                        <p className="text-sm text-muted-foreground">Paga en efectivo cuando recibas tu pedido</p>
                      </div>
                      {formData.paymentMethod === 'cash' && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </label>
                  )}

                  {/* Tarjeta de crédito/débito - Mercado Pago */}
                  {paymentConfig?.cardEnabled && (
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-[#009ee3] bg-[#009ee3]/5' : 'border-gray-200 hover:border-[#009ee3]/50'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'card' ? 'bg-[#009ee3] text-white' : 'bg-[#009ee3]/10 text-[#009ee3]'}`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#009ee3]">Tarjeta de crédito/débito</p>
                        <p className="text-sm text-muted-foreground">Paga seguro con Mercado Pago</p>
                      </div>
                      <div className="flex gap-1 mr-2">
                        <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">VISA</span>
                        </div>
                        <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                          <span className="text-white text-[6px] font-bold">MC</span>
                        </div>
                        <div className="w-8 h-5 bg-[#009ee3] rounded flex items-center justify-center">
                          <span className="text-white text-[6px] font-bold">MP</span>
                        </div>
                      </div>
                      {formData.paymentMethod === 'card' && (
                        <CheckCircle className="h-5 w-5 text-[#009ee3]" />
                      )}
                    </label>
                  )}

                  {/* Mercado Pago Info */}
                  {formData.paymentMethod === 'card' && (
                    <div className="ml-14 p-4 bg-[#009ee3]/5 rounded-lg border border-[#009ee3]/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                          <span className="text-[#009ee3] font-bold text-sm">MP</span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#009ee3]">Mercado Pago</p>
                          <p className="text-xs text-muted-foreground">Pago 100% seguro</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Al confirmar, serás redirigido a Mercado Pago para completar tu pago de forma segura.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Visa</span>
                        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Mastercard</span>
                        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> American Express</span>
                        <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Débito</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón móvil */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    `Confirmar pedido - ${formatPrice(total)}`
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>

              {/* Productos */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(item.product.images?.[0]?.url)}
                        alt={item.product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                      <p className="text-sm text-primary font-semibold">
                        {formatPrice(parseFloat(String(item.product.price)) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recojo</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Botón desktop */}
              <div className="hidden lg:block mt-6">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar pedido'
                  )}
                </Button>
              </div>

              {/* Info adicional */}
              <div className="mt-6 text-xs text-muted-foreground space-y-2">
                <p>🔒 Compra 100% segura</p>
                <p>🏪 Recojo en tienda sin costo</p>
                <p>↩️ Cambios hasta 7 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
