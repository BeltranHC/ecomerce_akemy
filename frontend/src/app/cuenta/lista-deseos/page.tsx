'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { useAuthStore, useWishlistStore, useCartStore } from '@/lib/store';
import { wishlistApi, cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop&auto=format';

export default function WishlistPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { removeFromWishlist: removeFromStore } = useWishlistStore();
  const { setCart } = useCartStore();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/cuenta/lista-deseos');
    }
  }, [isAuthenticated, authLoading, router]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await wishlistApi.getWishlist();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

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

  const getImageUrl = (product: any) => {
    const rawImageUrl = product.images?.[0]?.url;
    if (!rawImageUrl) return DEFAULT_PRODUCT_IMAGE;
    if (rawImageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${rawImageUrl}`;
    }
    return rawImageUrl;
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container-custom py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
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
              <div className="relative aspect-square">
                <Link href={`/productos/${product.slug}`}>
                  <Image
                    src={getImageUrl(product)}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
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
