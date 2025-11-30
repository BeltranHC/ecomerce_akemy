'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productsApi, cartApi } from '@/lib/api';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { useCartStore, useAuthStore } from '@/lib/store';
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductoDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const queryClient = useQueryClient();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number }) =>
      cartApi.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const product = productData?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container-custom py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
              <div className="h-10 bg-muted animate-pulse rounded w-1/3"></div>
              <div className="h-24 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container-custom py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              El producto que buscas no existe o ha sido eliminado.
            </p>
            <Link href="/productos">
              <Button>Ver todos los productos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const images = product.images?.length > 0 
    ? product.images 
    : [{ url: '/placeholder-product.jpg', altText: product.name }];

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCartMutation.mutate({ productId: product.id, quantity });
    } else {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0]?.url,
        quantity,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <span>/</span>
            <Link href="/productos" className="hover:text-foreground">Productos</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link 
                  href={`/productos?categoria=${product.category.slug}`}
                  className="hover:text-foreground"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(images[selectedImage]?.url)}
                  alt={images[selectedImage]?.altText || product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute left-4 top-4" variant="destructive">
                    -{discount}%
                  </Badge>
                )}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={() => setSelectedImage((i) => (i > 0 ? i - 1 : images.length - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setSelectedImage((i) => (i < images.length - 1 ? i + 1 : 0))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(img.url)}
                        alt={img.altText || ''}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-muted-foreground">{product.brand.name}</p>
              )}

              {/* Name */}
              <h1 className="text-3xl font-bold">{product.name}</h1>

              {/* SKU */}
              {product.sku && (
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              )}

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="destructive">Ahorra {discount}%</Badge>
                )}
              </div>

              {/* Stock */}
              <div>
                {product.stock > 10 && (
                  <p className="text-sm text-green-600">✓ En stock</p>
                )}
                {product.stock <= 10 && product.stock > 0 && (
                  <p className="text-sm text-orange-500">
                    ⚠ Solo quedan {product.stock} unidades
                  </p>
                )}
                {product.stock === 0 && (
                  <p className="text-sm text-destructive">✕ Agotado</p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="flex-1"
                  size="lg"
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {addToCartMutation.isPending ? 'Agregando...' : 'Agregar al carrito'}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Envío gratis</p>
                    <p className="text-xs text-muted-foreground">En compras mayores a $500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Compra segura</p>
                    <p className="text-xs text-muted-foreground">Tus datos están protegidos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Devoluciones</p>
                    <p className="text-xs text-muted-foreground">30 días para cambios o devoluciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
