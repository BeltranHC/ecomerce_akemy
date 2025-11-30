'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, X, Search, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { offersApi, productsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/100x100/e2e8f0/64748b?text=Sin+imagen';

const getImageUrl = (url: string | undefined): string => {
  if (!url) return DEFAULT_PRODUCT_IMAGE;
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};

interface SelectedProduct {
  productId: string;
  name: string;
  price: number;
  image?: string;
  specialPrice?: number;
}

export default function EditarOfertaPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'PERCENTAGE',
    value: '',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  // Cargar datos de la oferta
  const { data: offerData, isLoading: loadingOffer } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => offersApi.getById(offerId),
    enabled: !!offerId,
  });

  // Llenar formulario cuando carguen los datos
  useEffect(() => {
    if (offerData?.data) {
      const offer = offerData.data;
      setFormData({
        name: offer.name || '',
        slug: offer.slug || '',
        description: offer.description || '',
        type: offer.type || 'PERCENTAGE',
        value: offer.value?.toString() || '',
        isActive: offer.isActive ?? true,
        startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 16) : '',
        endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 16) : '',
      });
      
      // Cargar productos de la oferta
      if (offer.products && offer.products.length > 0) {
        setSelectedProducts(offer.products.map((op: any) => ({
          productId: op.product.id,
          name: op.product.name,
          price: Number(op.product.price),
          image: op.product.images?.[0]?.url,
          specialPrice: op.specialPrice ? Number(op.specialPrice) : undefined,
        })));
      }
    }
  }, [offerData]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products-search', searchTerm],
    queryFn: async () => {
      try {
        const response = await productsApi.getAll({ search: searchTerm, limit: 20 });
        return response.data;
      } catch (error) {
        const response = await productsApi.getPublic({ search: searchTerm, limit: 20 });
        return response.data;
      }
    },
    enabled: isProductDialogOpen,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => offersApi.update(offerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', offerId] });
      toast.success('Oferta actualizada correctamente');
      router.push('/admin/ofertas');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar la oferta');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => offersApi.delete(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast.success('Oferta eliminada correctamente');
      router.push('/admin/ofertas');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar la oferta');
    },
  });

  const products = productsData?.data || productsData?.products || productsData || [];

  const handleAddProduct = (product: any) => {
    if (selectedProducts.find((p) => p.productId === product.id)) {
      toast.error('Este producto ya está agregado');
      return;
    }

    setSelectedProducts([
      ...selectedProducts,
      {
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0]?.url,
      },
    ]);
    setIsProductDialogOpen(false);
    setSearchTerm('');
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
  };

  const handleUpdateSpecialPrice = (productId: string, specialPrice: string) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId
          ? { ...p, specialPrice: specialPrice ? parseFloat(specialPrice) : undefined }
          : p
      )
    );
  };

  const calculateDiscountedPrice = (originalPrice: number) => {
    const value = parseFloat(formData.value) || 0;
    switch (formData.type) {
      case 'PERCENTAGE':
        return originalPrice * (1 - value / 100);
      case 'FIXED_AMOUNT':
        return originalPrice - value;
      case 'SPECIAL_PRICE':
        return value;
      default:
        return originalPrice;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.value || !formData.startDate || !formData.endDate) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    const data = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      description: formData.description || undefined,
      type: formData.type,
      value: parseFloat(formData.value),
      isActive: formData.isActive,
      startDate: formData.startDate,
      endDate: formData.endDate,
      products: selectedProducts.map((p) => ({
        productId: p.productId,
        specialPrice: p.specialPrice,
      })),
    };

    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate();
    }
  };

  if (loadingOffer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/ofertas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Editar Oferta</h1>
            <p className="text-muted-foreground">Modifica los detalles de la promoción</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info básica */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Información de la oferta</h2>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la oferta *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="Ej: Black Friday 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="black-friday-2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe la oferta..."
                />
              </div>
            </div>

            {/* Configuración del descuento */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Configuración del descuento</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de descuento *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Porcentaje (%)</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Monto fijo (S/)</SelectItem>
                      <SelectItem value="SPECIAL_PRICE">Precio especial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {formData.type === 'PERCENTAGE'
                      ? 'Porcentaje de descuento *'
                      : formData.type === 'FIXED_AMOUNT'
                      ? 'Monto a descontar *'
                      : 'Precio especial *'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.type === 'PERCENTAGE' ? '100' : undefined}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de fin *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Productos en oferta</h2>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Agregar producto a la oferta</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar productos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <div className="max-h-[400px] overflow-y-auto space-y-2">
                        {loadingProducts ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : products.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No se encontraron productos
                          </p>
                        ) : (
                          products.map((product: any) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleAddProduct(product)}
                            >
                              <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={getImageUrl(product.images?.[0]?.url)}
                                  alt={product.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatPrice(product.price)}
                                </p>
                              </div>
                              <Button type="button" size="sm" variant="ghost">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay productos agregados</p>
                  <p className="text-sm">Agrega productos para aplicarles el descuento</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-primary font-semibold">
                            {formatPrice(
                              product.specialPrice || calculateDiscountedPrice(product.price)
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Precio especial"
                            value={product.specialPrice || ''}
                            onChange={(e) =>
                              handleUpdateSpecialPrice(product.productId, e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProduct(product.productId)}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                💡 Puedes establecer un precio especial individual para cada producto, o dejar vacío para usar el descuento general.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold">Estado</h2>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Oferta activa</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                La oferta solo se aplicará dentro del rango de fechas configurado.
              </p>
            </div>

            {/* Vista previa */}
            {formData.value && (
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold">Vista previa</h2>
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {formData.type === 'PERCENTAGE'
                      ? `${formData.value}% OFF`
                      : formData.type === 'FIXED_AMOUNT'
                      ? `-${formatPrice(parseFloat(formData.value))}`
                      : formatPrice(parseFloat(formData.value))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{formData.name || 'Nombre de la oferta'}</p>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
              <Link href="/admin/ofertas">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
