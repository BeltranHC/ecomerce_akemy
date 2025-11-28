'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { categoriesApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Folder } from 'lucide-react';

export default function CategoriasPage() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories-public'],
    queryFn: () => categoriesApi.getAll(),
  });

  const categories = categoriesData?.data || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Categorías</h1>
            <p className="text-muted-foreground">
              Explora nuestras categorías de productos
            </p>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2 mx-auto w-2/3"></div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay categorías disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/productos?categoria=${category.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center transition-all group-hover:shadow-lg">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <Folder className="h-16 w-16 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h3 className="text-white text-lg font-semibold text-center px-4">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  {category.description && (
                    <p className="mt-2 text-sm text-muted-foreground text-center line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </Link>
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
