'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Pencil, Briefcase, Palette, Gift, Folder } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'utiles-escolares': <Pencil className="h-8 w-8" />,
  'libros': <BookOpen className="h-8 w-8" />,
  'oficina': <Briefcase className="h-8 w-8" />,
  'arte-manualidades': <Palette className="h-8 w-8" />,
  'regalos': <Gift className="h-8 w-8" />,
  'default': <Folder className="h-8 w-8" />,
};

export function CategoriesSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((res) => res.data),
  });

  // Solo mostrar categorías principales (sin padre)
  const mainCategories = categories?.filter((cat: any) => !cat.parentId) || [];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Categorías</h2>
          <p className="mt-2 text-muted-foreground">
            Explora nuestras categorías de productos
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainCategories.slice(0, 6).map((category: any) => (
              <Link key={category.id} href={`/categorias/${category.slug}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {categoryIcons[category.slug] || categoryIcons['default']}
                    </div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category._count?.products || 0} productos
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/categorias"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todas las categorías →
          </Link>
        </div>
      </div>
    </section>
  );
}
