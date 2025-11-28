'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, CreditCard, Truck, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore, useAuthStore } from '@/lib/store';
import { cartApi, ordersApi } from '@/lib/api';
import { formatPrice, getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setCart, clearCart, getOrCreateSessionId } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'cash', // cash, card, transfer
  });

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
    // Cargar carrito si no hay datos
    const loadCart = async () => {
      if (!cart || cart.items.length === 0) {
        try {
          const sessionId = isAuthenticated ? undefined : getOrCreateSessionId();
          const response = await cartApi.getCart(sessionId);
          setCart(response.data);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    };
    loadCart();
  }, [cart, isAuthenticated, getOrCreateSessionId, setCart]);

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.district) {
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
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode || undefined,
        },
        useCart: true, // Usar los items del carrito
        notes: formData.notes || undefined,
        paymentMethod: formData.paymentMethod,
        shippingCost: shipping,
      };

      const response = await ordersApi.create(orderData);
      
      setOrderNumber(response.data.orderNumber);
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
  if (!cart || cart.items.length === 0) {
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
  const shipping = subtotal > 100 ? 0 : 10; // Envío gratis para pedidos mayores a S/100
  const total = subtotal + shipping;

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
                  Datos de envío
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

              {/* Dirección */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  Dirección de entrega
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Av. Principal 123, Dpto 456"
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Lima"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">Distrito *</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Miraflores"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Código postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="15074"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas adicionales</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                      rows={3}
                      placeholder="Instrucciones especiales para la entrega..."
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
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Pago contra entrega</p>
                      <p className="text-sm text-muted-foreground">Paga en efectivo cuando recibas tu pedido</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={formData.paymentMethod === 'transfer'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Transferencia bancaria</p>
                      <p className="text-sm text-muted-foreground">Recibirás los datos de la cuenta por email</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">Tarjeta de crédito/débito</p>
                      <p className="text-sm text-muted-foreground">Próximamente disponible</p>
                    </div>
                  </label>
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
                        {formatPrice(parseFloat(String(item.price || item.product.price)) * item.quantity)}
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
                  <span className="text-muted-foreground">Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">¡Envío gratis en pedidos mayores a S/100!</p>
                )}
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
                <p>📦 Entrega en 24-48 horas (Lima)</p>
                <p>↩️ Devoluciones hasta 30 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
