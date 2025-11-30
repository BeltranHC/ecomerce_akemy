'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Tag, Calendar, Percent, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { offersApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OfertasPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: () => offersApi.getAll().then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => offersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      toast.success('Oferta eliminada');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Error al eliminar la oferta');
    },
  });

  const offers = data?.data || [];

  const getOfferTypeLabel = (type: string) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Porcentaje';
      case 'FIXED_AMOUNT':
        return 'Monto fijo';
      case 'SPECIAL_PRICE':
        return 'Precio especial';
      default:
        return type;
    }
  };

  const getOfferValueDisplay = (offer: any) => {
    switch (offer.type) {
      case 'PERCENTAGE':
        return `${offer.value}%`;
      case 'FIXED_AMOUNT':
        return `-${formatPrice(offer.value)}`;
      case 'SPECIAL_PRICE':
        return formatPrice(offer.value);
      default:
        return offer.value;
    }
  };

  const isOfferActive = (offer: any) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    return offer.isActive && now >= start && now <= end;
  };

  const getOfferStatus = (offer: any) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);

    if (!offer.isActive) {
      return { label: 'Inactiva', variant: 'secondary' as const };
    }
    if (now < start) {
      return { label: 'Programada', variant: 'warning' as const };
    }
    if (now > end) {
      return { label: 'Finalizada', variant: 'destructive' as const };
    }
    return { label: 'Activa', variant: 'success' as const };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ofertas y Promociones</h1>
          <p className="text-muted-foreground">
            Gestiona descuentos y promociones para tus productos
          </p>
        </div>
        <Link href="/admin/ofertas/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva oferta
          </Button>
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/50">
          <Tag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay ofertas</h3>
          <p className="text-muted-foreground mb-4">
            Crea tu primera oferta para atraer más clientes
          </p>
          <Link href="/admin/ofertas/nueva">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear oferta
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oferta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Vigencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer: any) => {
                const status = getOfferStatus(offer);
                return (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{offer.name}</p>
                        {offer.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {offer.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {offer.type === 'PERCENTAGE' ? (
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{getOfferTypeLabel(offer.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {getOfferValueDisplay(offer)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{offer._count?.products || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/ofertas/${offer.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(offer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar oferta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los productos asociados ya no tendrán este descuento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
