'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Check, X, Star, Clock, CheckCircle, XCircle } from 'lucide-react';

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function ReviewsAdminPage() {
    const [statusFilter, setStatusFilter] = useState<ReviewStatus | undefined>('PENDING');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-reviews', statusFilter],
        queryFn: () => reviewsApi.getAll({ status: statusFilter, limit: 50 }),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) =>
            reviewsApi.updateStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
            toast.success('Reseña actualizada');
        },
        onError: () => {
            toast.error('Error al actualizar la reseña');
        },
    });

    const reviews = data?.data?.data || data?.data || [];

    const statusConfig: Record<ReviewStatus, { label: string; color: string; icon: any }> = {
        PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        APPROVED: { label: 'Aprobada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Gestión de Reseñas</h1>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
                <Button
                    variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('PENDING')}
                    size="sm"
                >
                    <Clock className="h-4 w-4 mr-2" />
                    Pendientes
                </Button>
                <Button
                    variant={statusFilter === 'APPROVED' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('APPROVED')}
                    size="sm"
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobadas
                </Button>
                <Button
                    variant={statusFilter === 'REJECTED' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('REJECTED')}
                    size="sm"
                >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazadas
                </Button>
                <Button
                    variant={statusFilter === undefined ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(undefined)}
                    size="sm"
                >
                    Todas
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Cargando reseñas...</div>
            ) : reviews.length === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        No hay reseñas {statusFilter ? `con estado "${statusConfig[statusFilter].label}"` : ''}.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review: any) => {
                        const status = review.status as ReviewStatus;
                        const config = statusConfig[status];
                        const StatusIcon = config.icon;

                        return (
                            <Card key={review.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${review.rating >= i ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <Badge className={config.color}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {config.label}
                                            </Badge>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString('es-PE')}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {review.user?.firstName} {review.user?.lastName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{review.user?.email}</p>
                                        </div>

                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-muted-foreground">Producto:</p>
                                            <p className="text-sm">{review.product?.name || 'Producto no disponible'}</p>
                                        </div>

                                        {review.comment && (
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Comentario:</p>
                                                <p className="text-sm">{review.comment}</p>
                                            </div>
                                        )}

                                        {status === 'PENDING' && (
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateStatusMutation.mutate({ id: review.id, status: 'APPROVED' })}
                                                    disabled={updateStatusMutation.isPending}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => updateStatusMutation.mutate({ id: review.id, status: 'REJECTED' })}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Rechazar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
