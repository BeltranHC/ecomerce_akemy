'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { productsApi, categoriesApi, cartApi } from '@/lib/api';
import { useCartStore, useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { setCart, getOrCreateSessionId } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Obtener información de la categoría
  const { data: categoryData, isLoading: loadingCategory } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      const categories = response.data || [];
      return categories.find((cat: any) => cat.slug === slug);
    },
    enabled: !!slug,
  });

  // Obtener productos de la categoría
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['category-products', slug],
    queryFn: () => productsApi.getPublic({ category: slug, limit: 50 }),
    enabled: !!slug,
  });

  const category = categoryData;
  const products = productsData?.data?.data || productsData?.data || [];

  const handleAddToCart = async (productId: string) => {
    try {
      const sessionId = isAuthenticated ? undefined : getOrCreateSessionId();
      const response = await cartApi.addItem({ productId, quantity: 1 }, sessionId);
      setCart(response.data);
      toast.success('Producto añadido al carrito');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al añadir al carrito');
    }
  };

  const isLoading = loadingCategory || loadingProducts;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/categorias" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Volver a categorías
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            {loadingCategory ? (
              <>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
              </>
            ) : category ? (
              <>
                <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                {category.description && (
                  <p className="text-muted-foreground">{category.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {products.length} producto(s) encontrado(s)
                </p>
              </>
            ) : (
              <h1 className="text-3xl font-bold mb-2">Categoría</h1>
            )}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No hay productos</h2>
              <p className="text-muted-foreground mb-6">
                No encontramos productos en esta categoría
              </p>
              <Link href="/productos">
                <Button>Ver todos los productos</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
