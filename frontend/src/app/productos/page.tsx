'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ChatWidget } from '@/components/chat/chat-widget';
import { ProductCard } from '@/components/products/product-card';
import { productsApi, categoriesApi, brandsApi } from '@/lib/api';

export default function ProductosPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState<string>('all');
  const [brandSlug, setBrandSlug] = useState<string>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);

  // Leer parámetros de URL al cargar
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('categoria') || searchParams.get('category');
    const brandParam = searchParams.get('marca') || searchParams.get('brand');
    
    if (searchParam) setSearch(searchParam);
    if (categoryParam) setCategorySlug(categoryParam);
    if (brandParam) setBrandSlug(brandParam);
  }, [searchParams]);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', page, search, categorySlug, brandSlug, sortBy],
    queryFn: () =>
      productsApi.getPublic({
        page,
        limit: 12,
        search: search || undefined,
        category: categorySlug !== 'all' ? categorySlug : undefined,
        brand: brandSlug !== 'all' ? brandSlug : undefined,
        sortBy,
      }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories-public'],
    queryFn: () => categoriesApi.getPublic(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands-public'],
    queryFn: () => brandsApi.getPublic(),
  });

  // La respuesta tiene estructura { data: { data: products, meta: {...} } }
  const products = productsData?.data?.data || [];
  const totalPages = productsData?.data?.meta?.totalPages || 1;
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  const brands = Array.isArray(brandsData?.data) ? brandsData.data : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Productos</h1>
            <p className="text-muted-foreground">
              Encuentra todo lo que necesitas para tu oficina y escuela
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={brandSlug} onValueChange={setBrandSlug}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map((brand: any) => (
                  <SelectItem key={brand.id} value={brand.slug}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Más recientes</SelectItem>
                <SelectItem value="price-asc">Menor precio</SelectItem>
                <SelectItem value="price-desc">Mayor precio</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}
