'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { useAuthStore, useWishlistStore, useCartStore } from '@/lib/store';
import { wishlistApi, cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, setIsLoading } = useAuthStore();
  const { removeFromWishlist: removeFromStore, setWishlistIds } = useWishlistStore();
  const { setCart } = useCartStore();

  // Verificar token directamente para habilitar la query
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken') || Cookies.get('accessToken');
      setHasToken(!!token);
    }
  }, [isAuthenticated, authLoading]);

  // Timeout de seguridad: si authLoading está en true por más de 2 segundos, forzar a false
  useEffect(() => {
    if (authLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [authLoading, setIsLoading]);

  // Redirigir si no está autenticado y no hay token (después de que authLoading se resuelva)
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !hasToken) {
      router.push('/login?redirect=/cuenta/lista-deseos');
    }
  }, [isAuthenticated, authLoading, hasToken, router]);

  // Habilitar query si está autenticado O si hay token (incluso si authLoading es true)
  const queryEnabled = isAuthenticated || hasToken;

  const { data: products, isLoading, error, isError } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await wishlistApi.getWishlist();
      const data = response?.data;
      return Array.isArray(data) ? data : [];
    },
    enabled: queryEnabled && !authLoading, // Solo esperar si authLoading es false
    staleTime: 1 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        router.push('/login?redirect=/cuenta/lista-deseos');
        return false;
      }
      return failureCount < 1;
    },
    refetchOnWindowFocus: true,
  });

  // Sincronizar el store local con los productos cargados
  useEffect(() => {
    if (products && Array.isArray(products)) {
      const productIds = products.map((p: any) => p.id);
      setWishlistIds(productIds);
    }
  }, [products, setWishlistIds]);

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.removeFromWishlist(productId),
    onSuccess: (_, productId) => {
      removeFromStore(productId);
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Producto eliminado de tu lista de deseos');
    },
    onError: () => {
      toast.error('Error al eliminar el producto');
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => cartApi.addItem({ productId, quantity: 1 }),
    onSuccess: (response) => {
      if (response.data) {
        setCart(response.data);
      }
      toast.success('Producto agregado al carrito');
    },
    onError: () => {
      toast.error('Error al agregar al carrito');
    },
  });

  // Si está cargando la autenticación y no hay token, mostrar spinner
  if (authLoading && !hasToken) {
    return (
      <div className="container-custom py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, no hay token y authLoading es false, redirigir
  if (!isAuthenticated && !hasToken && !authLoading) {
    return null; // Se redirigirá en el useEffect
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            Mi Lista de Deseos
          </h1>
          <p className="text-muted-foreground mt-1">
            {products?.length || 0} productos guardados
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError || error ? (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 mx-auto text-red-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar</h2>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error 
              ? error.message 
              : 'No se pudo cargar tu lista de deseos. Por favor, intenta de nuevo.'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['wishlist'] })} 
              variant="outline"
            >
              Reintentar
            </Button>
            <Button 
              onClick={() => router.push('/productos')} 
              className="gradient-primary"
            >
              Explorar Productos
            </Button>
          </div>
        </Card>
      ) : products?.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Tu lista de deseos está vacía</h2>
          <p className="text-muted-foreground mb-6">
            Explora nuestros productos y guarda tus favoritos haciendo clic en el corazón
          </p>
          <Link href="/productos">
            <Button className="gradient-primary">
              Explorar Productos
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <Card key={product.id} className="group overflow-hidden">
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                <Link href={`/productos/${product.slug}`}>
                  <Image
                    src={getImageUrl(product.images?.[0]?.url)}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </Link>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeMutation.mutate(product.id)}
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                {product.brand && (
                  <p className="text-xs font-medium text-primary/70 uppercase tracking-wide mb-1">
                    {product.brand.name}
                  </p>
                )}
                <Link href={`/productos/${product.slug}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold gradient-text">
                    {formatPrice(product.price)}
                  </span>
                  <Button 
                    size="sm" 
                    className="rounded-full gradient-primary"
                    onClick={() => addToCartMutation.mutate(product.id)}
                    disabled={addToCartMutation.isPending}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
