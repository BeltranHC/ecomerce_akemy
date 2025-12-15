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
import { cartApi, ordersApi, settingsApi } from '@/lib/api';
import { formatPrice, getImageUrl } from '@/lib/utils';
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
    paymentMethod: 'yape',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  // Actualizar método de pago por defecto basado en configuración
  useEffect(() => {
    if (paymentConfig) {
      if (paymentConfig.yapeEnabled && formData.paymentMethod === 'yape') return;
      if (paymentConfig.cashEnabled) {
        setFormData(prev => ({ ...prev, paymentMethod: 'cash' }));
      } else if (paymentConfig.yapeEnabled) {
        setFormData(prev => ({ ...prev, paymentMethod: 'yape' }));
      } else if (paymentConfig.transferEnabled) {
        setFormData(prev => ({ ...prev, paymentMethod: 'transfer' }));
      } else if (paymentConfig.paypalEnabled) {
        setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }));
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
      
      setOrderNumber(response.data.orderNumber);
      setOrderId(response.data.id);
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

                  {/* Yape */}
                  {paymentConfig?.yapeEnabled && (
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'yape' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="yape"
                      checked={formData.paymentMethod === 'yape'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'yape' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-500'}`}>
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-purple-700">Yape</p>
                      <p className="text-sm text-muted-foreground">Paga con tu billetera digital Yape</p>
                    </div>
                    {formData.paymentMethod === 'yape' && (
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                    )}
                  </label>
                  )}

                  {/* Yape Info */}
                  {formData.paymentMethod === 'yape' && paymentConfig && (
                    <div className="ml-14 p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-3">
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="w-40 h-40 bg-white border border-purple-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <Image
                            src="/payments/qr-yape.jpeg"
                            alt="QR Yape"
                            width={160}
                            height={160}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 space-y-2 text-sm text-purple-800">
                          <p className="font-semibold">Paga con Yape</p>
                          <p>Número: <strong>{paymentConfig.yapePhone}</strong></p>
                          <p>Alias / Nombre: <strong>{paymentConfig.yapeName}</strong></p>
                          <p>Monto: <strong>{formatPrice(total)}</strong></p>
                          <p className="text-xs text-purple-700">Adjunta el comprobante indicando tu número de pedido.</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700">Pasos:</p>
                        <ol className="text-xs text-purple-700 space-y-1 list-decimal list-inside">
                          <li>Escanea el QR o paga al número indicado.</li>
                          <li>Coloca el monto exacto: {formatPrice(total)}.</li>
                          <li>Envía el comprobante y tu número de pedido.</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Tarjeta de crédito/débito */}
                  {paymentConfig?.cardEnabled && (
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-700">Tarjeta de crédito/débito</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                    </div>
                    <div className="flex gap-1 mr-2">
                      <div className="w-8 h-5 bg-[#1A1F71] rounded flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">VISA</span>
                      </div>
                      <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
                        <span className="text-white text-[6px] font-bold">MC</span>
                      </div>
                    </div>
                    {formData.paymentMethod === 'card' && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </label>
                  )}

                  {/* Card Form */}
                  {formData.paymentMethod === 'card' && (
                    <div className="ml-14 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
                      <div>
                        <Label htmlFor="cardName" className="text-blue-800">Nombre en la tarjeta</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="JUAN PEREZ"
                          className="bg-white border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber" className="text-blue-800">Número de tarjeta</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="bg-white border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry" className="text-blue-800">Vencimiento</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            maxLength={5}
                            className="bg-white border-blue-200 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc" className="text-blue-800">CVC</Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength={4}
                            className="bg-white border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Tus datos están protegidos con encriptación SSL
                      </p>
                    </div>
                  )}

                  {/* PayPal */}
                  {paymentConfig?.paypalEnabled && (
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'paypal' ? 'border-[#003087] bg-[#003087]/5' : 'border-gray-200 hover:border-[#003087]/50'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'paypal' ? 'bg-[#003087] text-white' : 'bg-[#003087]/10 text-[#003087]'}`}>
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#003087]">PayPal</p>
                      <p className="text-sm text-muted-foreground">Paga de forma segura con tu cuenta PayPal</p>
                    </div>
                    <div className="w-16 h-6 mr-2">
                      <svg viewBox="0 0 124 33" className="w-full h-full">
                        <path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906z"/>
                        <path fill="#179BD7" d="M66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.03.998 1.177 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.568.568 0 0 0-.562-.657zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317z"/>
                        <path fill="#253B80" d="M84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/>
                        <path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906z"/>
                        <path fill="#179BD7" d="M115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.03 1 1.177 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.657zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317z"/>
                        <path fill="#253B80" d="M119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/>
                      </svg>
                    </div>
                    {formData.paymentMethod === 'paypal' && (
                      <CheckCircle className="h-5 w-5 text-[#003087]" />
                    )}
                  </label>
                  )}

                  {/* PayPal Info */}
                  {formData.paymentMethod === 'paypal' && paymentConfig && (
                    <div className="ml-14 p-4 bg-[#003087]/5 rounded-lg border border-[#003087]/20">
                      <p className="text-sm text-[#003087]">
                        Envía tu pago de <strong>{formatPrice(total)}</strong> a: <strong>{paymentConfig.paypalEmail}</strong>
                      </p>
                      <p className="text-xs text-[#003087]/70 mt-2">
                        Envía el comprobante de pago a {paymentConfig.storeEmail}
                      </p>
                    </div>
                  )}

                  {/* Transferencia bancaria */}
                  {paymentConfig?.transferEnabled && (
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'transfer' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'transfer' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-500'}`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-700">Transferencia bancaria</p>
                      <p className="text-sm text-muted-foreground">Depósito o transferencia a nuestra cuenta</p>
                    </div>
                    {formData.paymentMethod === 'transfer' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </label>
                  )}

                  {/* Transfer Info */}
                  {formData.paymentMethod === 'transfer' && paymentConfig && (
                    <div className="ml-14 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800 mb-2">Datos para transferencia:</p>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Banco:</strong> {paymentConfig.bankName}</p>
                        <p><strong>Cuenta:</strong> {paymentConfig.bankAccountNumber}</p>
                        <p><strong>CCI:</strong> {paymentConfig.bankCCI}</p>
                        <p><strong>Titular:</strong> {paymentConfig.bankAccountHolder}</p>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        * Envía el comprobante de pago a {paymentConfig.storeEmail}
                      </p>
                    </div>
                  )}}
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
                      <Image
                        src={getImageUrl(item.product.images?.[0]?.url)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
