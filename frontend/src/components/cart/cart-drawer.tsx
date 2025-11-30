'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore, useCartStore, useAuthStore } from '@/lib/store';
import { cartApi } from '@/lib/api';
import { formatPrice, getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { cart, setCart, updateItemQuantity, removeItem, isLoading, setIsLoading, getOrCreateSessionId } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const sessionId = isAuthenticated ? undefined : getOrCreateSessionId();

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    // Optimistic update
    updateItemQuantity(itemId, quantity);

    try {
      const response = await cartApi.updateItem(itemId, { quantity }, sessionId);
      setCart(response.data);
    } catch (error: any) {
      // Revert on error
      toast.error(error.response?.data?.message || 'Error al actualizar cantidad');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    // Optimistic update
    removeItem(itemId);

    try {
      const response = await cartApi.removeItem(itemId, sessionId);
      setCart(response.data);
      toast.success('Producto eliminado del carrito');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar producto');
    }
  };

  if (!isCartOpen) return null;

  return (
    <Fragment>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Carrito ({cart?.totalItems || cart?.itemCount || 0})
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
              <Button onClick={() => setCartOpen(false)} asChild>
                <Link href="/productos">Ver productos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-3 rounded-lg border bg-card relative overflow-hidden ${item.hasOffer ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  {/* Offer Badge */}
                  {item.hasOffer && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl-lg">
                      <Tag className="h-3 w-3 inline mr-1" />
                      OFERTA
                    </div>
                  )}
                  
                  {/* Image */}
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={getImageUrl(item.product.images?.[0]?.url)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/productos/${item.product.slug}`}
                      className="font-medium text-sm line-clamp-2 hover:text-primary"
                      onClick={() => setCartOpen(false)}
                    >
                      {item.product.name}
                    </Link>
                    
                    {/* Price with offer */}
                    <div className="mt-1">
                      {item.hasOffer ? (
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-primary font-semibold">
                          {formatPrice(item.price || item.product.price)}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4 bg-gradient-to-t from-muted/30 to-background">
            {/* Discount Summary */}
            {(cart as any).totalDiscount > 0 && (
              <div className="flex items-center justify-between text-sm bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Descuento aplicado
                </span>
                <span className="font-semibold">-{formatPrice((cart as any).totalDiscount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(cart.subtotal || (cart as any).total || 0)}</span>
            </div>
            <Button className="w-full gradient-primary" size="lg" asChild>
              <Link href="/checkout" onClick={() => setCartOpen(false)}>
                Finalizar compra
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCartOpen(false)}
              asChild
            >
              <Link href="/carrito">Ver carrito completo</Link>
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
