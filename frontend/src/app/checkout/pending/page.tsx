'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Clock, Package, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function CheckoutPendingPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order');

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12">
                <div className="container-custom max-w-lg">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        {/* Pending Icon */}
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="h-12 w-12 text-white animate-pulse" />
                        </div>

                        <h1 className="text-3xl font-bold text-yellow-600 mb-4">
                            Pago Pendiente
                        </h1>

                        <p className="text-muted-foreground mb-6">
                            Tu pago está siendo procesado. Esto puede tomar unos minutos.
                            Te notificaremos por correo electrónico cuando se confirme.
                        </p>

                        {orderId && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-yellow-700">Número de pedido</p>
                                <p className="text-xl font-bold text-yellow-800">{orderId}</p>
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                            <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                ¿Qué pasará ahora?
                            </p>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Recibirás un correo cuando el pago sea confirmado</li>
                                <li>• Puedes revisar el estado en "Mis pedidos"</li>
                                <li>• El proceso puede tomar hasta 48 horas</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <Button asChild className="w-full" size="lg">
                                <Link href="/cuenta/pedidos">
                                    <Package className="mr-2 h-5 w-5" />
                                    Ver mis pedidos
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full" size="lg">
                                <Link href="/">
                                    <Home className="mr-2 h-5 w-5" />
                                    Volver al inicio
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-8 pt-6 border-t">
                            <p className="text-sm text-muted-foreground">
                                Si tienes dudas, contáctanos al chat de soporte
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
