'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ProductCard } from '@/components/products/product-card';
import { productsApi } from '@/lib/api';
import { Tag, Percent } from 'lucide-react';

export default function OfertasPage() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products-offers'],
    queryFn: () =>
      productsApi.getPublic({
        page: 1,
        limit: 50,
      }),
  });

  // La respuesta tiene estructura { data: { data: products, meta: {...} } }
  const products = productsData?.data?.data || [];
  // Filter products that have a comparePrice (on sale)
  const onSaleProducts = Array.isArray(products) 
    ? products.filter((p: any) => p.comparePrice && p.comparePrice > p.price) 
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-12">
          <div className="container-custom text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Percent className="h-10 w-10" />
              <h1 className="text-4xl font-bold">Ofertas Especiales</h1>
            </div>
            <p className="text-xl opacity-90">
              ¡Aprovecha nuestros mejores descuentos!
            </p>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : onSaleProducts.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No hay ofertas disponibles</h2>
              <p className="text-muted-foreground">
                Vuelve pronto para ver nuestras nuevas promociones
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {onSaleProducts.length} productos en oferta
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {onSaleProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
