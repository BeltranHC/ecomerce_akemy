'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsApi, cartApi } from '@/lib/api';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export function RecentProducts() {
  const { setCart, getOrCreateSessionId } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: recentData, isLoading } = useQuery({
    queryKey: ['recent-products-home'],
    queryFn: () => productsApi.getPublic({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }).then((res) => res.data),
  });

  const recentProducts = Array.isArray(recentData) ? recentData : recentData?.data || [];

  const handleAddToCart = async (productId: string) => {
    try {
      const sessionId = isAuthenticated ? undefined : getOrCreateSessionId();

      const response = await cartApi.addItem({
        productId,
        quantity: 1,
      }, sessionId);

      setCart(response.data);
      toast.success('Producto añadido al carrito');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al añadir al carrito');
    }
  };

  if (!isLoading && recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                Recién llegados
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </h2>
              <p className="mt-1 text-muted-foreground">
                Los productos más nuevos de nuestra tienda
              </p>
            </div>
          </div>
          <Link
            href="/productos?sort=newest"
            className="hidden sm:inline-flex text-sm font-medium text-primary hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentProducts.slice(0, 10).map((product: any, index: number) => (
              <div key={product.id} className="relative">
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    NUEVO
                  </div>
                )}
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/productos?sort=newest"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos los productos →
          </Link>
        </div>
      </div>
    </section>
  );
}
