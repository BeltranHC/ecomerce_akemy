'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ProductCard } from '@/components/products/product-card';
import { offersApi } from '@/lib/api';
import { Tag, Percent, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getImageUrl = (url: string | undefined): string => {
  if (!url) return 'https://placehold.co/400x400/e2e8f0/64748b?text=Sin+imagen';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};

export default function OfertasPage() {
  const { data: offersData, isLoading } = useQuery({
    queryKey: ['active-offers'],
    queryFn: () => offersApi.getActive(),
  });

  const offers = offersData?.data || [];
  // Filtrar solo ofertas que tienen productos
  const offersWithProducts = Array.isArray(offers) 
    ? offers.filter((offer: any) => offer.products && offer.products.length > 0) 
    : [];

  // Si no hay ofertas activas, no mostrar nada
  if (!isLoading && offersWithProducts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container-custom py-16">
            <div className="text-center">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No hay ofertas disponibles</h2>
              <p className="text-muted-foreground">
                Vuelve pronto para ver nuestras nuevas promociones
              </p>
            </div>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

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
          ) : (
            <div className="space-y-12">
              {offersWithProducts.map((offer: any) => (
                <div key={offer.id} className="space-y-6">
                  {/* Offer Header */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{offer.name}</h2>
                        <Badge variant="destructive" className="text-lg px-3 py-1">
                          {offer.type === 'PERCENTAGE' 
                            ? `${offer.value}% OFF` 
                            : offer.type === 'FIXED_AMOUNT'
                            ? `-S/ ${offer.value}`
                            : `S/ ${offer.value}`}
                        </Badge>
                      </div>
                      {offer.description && (
                        <p className="text-muted-foreground mt-1">{offer.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Hasta {new Date(offer.endDate).toLocaleDateString('es-PE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {offer.products.map((offerProduct: any) => {
                      const product = offerProduct.product;
                      const originalPrice = Number(product.price);
                      const discountedPrice = offerProduct.specialPrice 
                        ? Number(offerProduct.specialPrice)
                        : offer.type === 'PERCENTAGE'
                        ? originalPrice * (1 - offer.value / 100)
                        : offer.type === 'FIXED_AMOUNT'
                        ? originalPrice - offer.value
                        : offer.value;

                      // Transformar producto para ProductCard
                      const productWithDiscount = {
                        ...product,
                        price: discountedPrice,
                        comparePrice: originalPrice,
                        images: product.images?.map((img: any) => ({
                          ...img,
                          url: img.url,
                        })),
                      };

                      return (
                        <ProductCard key={product.id} product={productWithDiscount} />
                      );
                    })}
                  </div>
                </div>
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
