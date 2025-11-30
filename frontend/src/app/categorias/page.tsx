'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { categoriesApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Folder, Pencil, BookOpen, Briefcase, Palette, Gift, Archive, FileText, Package } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'utiles-escolares': <Pencil className="h-12 w-12" />,
  'cuadernos': <BookOpen className="h-12 w-12" />,
  'escritura': <Pencil className="h-12 w-12" />,
  'archivadores': <Archive className="h-12 w-12" />,
  'papeleria': <FileText className="h-12 w-12" />,
  'arte-manualidades': <Palette className="h-12 w-12" />,
  'oficina': <Briefcase className="h-12 w-12" />,
  'regalos': <Gift className="h-12 w-12" />,
  'default': <Package className="h-12 w-12" />,
};

export default function CategoriasPage() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories-public'],
    queryFn: async () => {
      const response = await categoriesApi.getPublic();
      return response.data;
    },
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const mainCategories = categories.filter((cat: any) => !cat.parentId);

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
                  <div className="bg-muted aspect-square rounded-2xl mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2 mx-auto w-2/3"></div>
                </div>
              ))}
            </div>
          ) : mainCategories.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No hay categorías disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mainCategories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/productos?categoria=${category.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 p-6 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/30 group-hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                        {categoryIcons[category.slug] || categoryIcons['default']}
                      </div>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category._count?.products || 0} productos
                      </p>
                      {category.description && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
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
