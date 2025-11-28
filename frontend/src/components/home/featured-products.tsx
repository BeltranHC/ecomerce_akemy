'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsApi, cartApi } from '@/lib/api';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore, useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function FeaturedProducts() {
  const { setCart, getOrCreateSessionId } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getFeatured().then((res) => res.data),
  });

  // Manejar diferentes estructuras de respuesta
  const products = Array.isArray(data) ? data : data?.data || [];

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

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Productos destacados</h2>
            <p className="mt-2 text-muted-foreground">
              Los más populares de nuestra tienda
            </p>
          </div>
          <Link
            href="/productos?featured=true"
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
            {products?.slice(0, 10).map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/productos?featured=true"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos los productos destacados →
          </Link>
        </div>
      </div>
    </section>
  );
}
