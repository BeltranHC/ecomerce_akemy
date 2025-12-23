'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { useAuthStore, useWishlistStore } from '@/lib/store';
import { wishlistApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  compareAtPrice?: number; // alias
  images?: Array<{ url: string; alt?: string; altText?: string }>;
  brand?: { name: string };
  stock: number;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  
  const isWishlisted = isInWishlist(product.id);
  
  const comparePrice = product.comparePrice || product.compareAtPrice;
  const discount = comparePrice
    ? Math.round((1 - product.price / comparePrice) * 100)
    : 0;

  // Usar la función helper para obtener la URL de la imagen
  const imageUrl = imageError ? PLACEHOLDER_IMAGE : getImageUrl(product.images?.[0]?.url);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar a tu lista de deseos');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    setIsWishlistLoading(true);
    try {
      const response = await wishlistApi.toggleWishlist(product.id);
      if (response.data.added) {
        addToWishlist(product.id);
        toast.success('Agregado a tu lista de deseos');
      } else {
        removeFromWishlist(product.id);
        toast.success('Eliminado de tu lista de deseos');
      }
      // Invalidar la query de wishlist para que se actualice en todas las páginas
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    } catch (error) {
      toast.error('Error al actualizar la lista de deseos');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      {/* Discount Badge */}
      {discount > 0 && (
        <Badge className="absolute left-3 top-3 z-10 gradient-primary border-0 shadow-lg">
          -{discount}%
        </Badge>
      )}

      {/* Featured Badge */}
      {product.isFeatured && !discount && (
        <Badge className="absolute left-3 top-3 z-10 bg-amber-500 border-0 shadow-lg">
          ⭐ Destacado
        </Badge>
      )}

      {/* Action Buttons */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <Button
          variant="secondary"
          size="icon"
          className={`h-9 w-9 rounded-full shadow-lg transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/90 backdrop-blur-sm hover:bg-red-500 hover:text-white'
          }`}
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
        <Link href={`/productos/${product.slug}`}>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-primary hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Image */}
      <Link href={`/productos/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-medium text-primary/70 uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}

        {/* Name */}
        <Link href={`/productos/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold gradient-text">
            {formatPrice(product.price)}
          </span>
          {comparePrice && comparePrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            ¡Solo quedan {product.stock}!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive"></span>
            Agotado
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full rounded-full gradient-primary border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          size="sm"
          disabled={product.stock === 0}
          onClick={() => onAddToCart?.(product.id)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? 'Agotado' : 'Agregar'}
        </Button>
      </CardFooter>
    </Card>
  );
}
