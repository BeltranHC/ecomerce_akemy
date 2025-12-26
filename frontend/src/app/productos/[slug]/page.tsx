'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ChatWidget } from '@/components/chat/chat-widget';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productsApi, cartApi, reviewsApi, wishlistApi } from '@/lib/api';
import { formatPrice, getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
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
  Star,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductoDetailPage() {
  const params = useParams();
  const slug = (params?.slug || '') as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imageError, setImageError] = useState(false);
  const queryClient = useQueryClient();
  const { addItem, setCart, getOrCreateSessionId } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addToWishlist: addToWishlistStore, removeFromWishlist: removeFromWishlistStore, setWishlistIds } = useWishlistStore();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['reviews', slug],
    queryFn: () => reviewsApi.getByProduct(productData?.data?.id),
    enabled: !!productData?.data?.id,
  });

  // Cargar wishlist IDs si está autenticado
  const { data: wishlistIdsData } = useQuery({
    queryKey: ['wishlistIds'],
    queryFn: async () => {
      const response = await wishlistApi.getWishlistIds();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  // Actualizar store cuando se cargan los wishlist IDs
  if (wishlistIdsData && Array.isArray(wishlistIdsData)) {
    setWishlistIds(wishlistIdsData);
  }

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number }) =>
      cartApi.addItem(data),
    onSuccess: async (response) => {
      if (response.data) {
        setCart(response.data);
      } else {
        // Si no hay respuesta, recargar el carrito
        const sessionId = isAuthenticated ? undefined : getOrCreateSessionId();
        const cartResponse = await cartApi.get(sessionId);
        if (cartResponse.data) {
          setCart(cartResponse.data);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Producto agregado al carrito');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al agregar al carrito');
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: { productId: string; rating: number; comment: string }) =>
      reviewsApi.create(data),
    onSuccess: () => {
      toast.success('Reseña enviada. Quedará pendiente hasta aprobación.');
      setComment('');
      setRating(5);
      refetchReviews();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'No se pudo enviar la reseña');
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: (productId: string) => {
      const isInWishlistValue = isInWishlist(productId);
      if (isInWishlistValue) {
        return wishlistApi.removeFromWishlist(productId);
      } else {
        return wishlistApi.addToWishlist(productId);
      }
    },
    onSuccess: (_, productId) => {
      const isInWishlistValue = isInWishlist(productId);
      if (isInWishlistValue) {
        removeFromWishlistStore(productId);
        toast.success('Producto eliminado de favoritos');
      } else {
        addToWishlistStore(productId);
        toast.success('Producto agregado a favoritos');
      }
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar favoritos');
    },
  });

  const product = productData?.data;
  const reviews = reviewsData?.data || [];
  const averageRating = reviews.length
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

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
    : [{ url: PLACEHOLDER_IMAGE, altText: product.name }];

  const handleAddToCart = async () => {
    if (isAuthenticated) {
      addToCartMutation.mutate({ productId: product.id, quantity });
    } else {
      try {
        const sessionId = getOrCreateSessionId();
        const response = await cartApi.addItem({ productId: product.id, quantity }, sessionId);
        if (response.data) {
          setCart(response.data);
        }
        toast.success('Producto agregado al carrito');
      } catch (error: any) {
        // Si falla la API, usar el carrito local como fallback
        addItem({
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: images[0]?.url,
          quantity,
        });
        toast.success('Producto agregado al carrito');
      }
    }
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar productos a favoritos');
      return;
    }
    wishlistMutation.mutate(product.id);
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para dejar una reseña');
      return;
    }
    if (!rating) {
      toast.error('Selecciona una calificación');
      return;
    }
    createReviewMutation.mutate({ productId: product.id, rating, comment });
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
                  src={imageError ? PLACEHOLDER_IMAGE : getImageUrl(images[selectedImage]?.url)}
                  alt={images[selectedImage]?.altText || product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
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
                      onClick={() => {
                        setSelectedImage((i) => (i > 0 ? i - 1 : images.length - 1));
                        setImageError(false);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        setSelectedImage((i) => (i < images.length - 1 ? i + 1 : 0));
                        setImageError(false);
                      }}
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
                      onClick={() => {
                        setSelectedImage(index);
                        setImageError(false);
                      }}
                      className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${selectedImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(img.url)}
                        alt={img.altText || ''}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                  disabled={wishlistMutation.isPending}
                  className={isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                  />
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

          {/* Reviews */}
          <div className="mt-12 grid lg:grid-cols-[2fr,1fr] gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reseñas</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${averageRating >= i ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{averageRating ? averageRating.toFixed(1) : 'Sin reseñas'}</span>
                    {reviews.length > 0 && (
                      <span className="text-xs text-muted-foreground">({reviews.length})</span>
                    )}
                  </div>
                </div>
              </div>

              {isLoadingReviews && <p className="text-sm text-muted-foreground">Cargando reseñas...</p>}

              {!isLoadingReviews && reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">Aún no hay reseñas aprobadas para este producto.</p>
              )}

              {!isLoadingReviews && reviews.length > 0 && (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${review.rating >= i ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">{review.user?.firstName} {review.user?.lastName}</p>
                      {review.comment && <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div>
                <p className="text-lg font-semibold">Escribe una reseña</p>
                <p className="text-sm text-muted-foreground">Debe ser aprobada por un administrador antes de mostrarse.</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Tu calificación</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      className={`p-2 rounded-full border ${rating >= i ? 'border-yellow-400 bg-yellow-50' : 'border-transparent'}`}
                    >
                      <Star className={`h-6 w-6 ${rating >= i ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Comentario (opcional)</p>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos tu experiencia con el producto"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                disabled={createReviewMutation.isPending}
                className="w-full"
              >
                {createReviewMutation.isPending ? 'Enviando...' : 'Enviar reseña'}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground text-center">Inicia sesión para poder reseñar.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}
