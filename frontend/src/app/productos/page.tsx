'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import Link from 'next/link';
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
import { productsApi, categoriesApi, brandsApi, cartApi } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ url: string }>;
}

function ProductosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState<string>('all');
  const [brandSlug, setBrandSlug] = useState<string>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);

  // Search suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { getOrCreateSessionId, setCart } = useCartStore();

  // Fetch suggestions with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (search.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await productsApi.getSuggestions(search);
        setSuggestions(response.data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para agregar al carrito
  const handleAddToCart = async (productId: string) => {
    try {
      const sessionId = getOrCreateSessionId();
      await cartApi.addItem({ productId, quantity: 1 }, sessionId);
      // Recargar el carrito
      const response = await cartApi.get(sessionId);
      if (response.data) {
        setCart(response.data);
      }
      toast.success('Producto agregado al carrito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito');
    }
  };

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


  const { data: categoriesData, error: catError, isLoading: catLoading } = useQuery({
    queryKey: ['categories-public'],
    queryFn: async () => {
      console.log('Fetching categories...');
      const response = await categoriesApi.getPublic();
      console.log('Categories response:', response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnMount: true,
  });

  const { data: brandsData, error: brandError, isLoading: brandLoading } = useQuery({
    queryKey: ['brands-public'],
    queryFn: async () => {
      console.log('Fetching brands...');
      const response = await brandsApi.getPublic();
      console.log('Brands response:', response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnMount: true,
  });

  // La respuesta tiene estructura { data: { data: products, meta: {...} } }
  const products = productsData?.data?.data || [];
  const totalPages = productsData?.data?.meta?.totalPages || 1;
  // Categories and brands are returned directly as arrays from the API
  const rawCategories = categoriesData?.data;
  const rawBrands = brandsData?.data;
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  const brands = Array.isArray(rawBrands) ? rawBrands : [];

  // Debug log
  console.log('Categories data:', { raw: rawCategories, parsed: categories.length, error: catError, loading: catLoading });
  console.log('Brands data:', { raw: rawBrands, parsed: brands.length, error: brandError, loading: brandLoading });

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
            <div className="relative flex-1" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="pl-9"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <Link
                        key={suggestion.id}
                        href={`/productos/${suggestion.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearch('');
                        }}
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageUrl(suggestion.images?.[0]?.url)}
                            alt={suggestion.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER_IMAGE;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.name}
                          </p>
                          <p className="text-sm text-primary font-semibold">
                            {formatPrice(Number(suggestion.price))}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            <Select value={categorySlug} onValueChange={setCategorySlug} disabled={catLoading}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder={catLoading ? "Cargando..." : "Categoría"} />
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
            <Select value={brandSlug} onValueChange={setBrandSlug} disabled={brandLoading}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder={brandLoading ? "Cargando..." : "Marca"} />
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
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
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

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    }>
      <ProductosContent />
    </Suspense>
  );
}
