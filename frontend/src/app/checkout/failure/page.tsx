'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

function CheckoutFailureContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order');

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12">
                <div className="container-custom max-w-lg">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        {/* Error Icon */}
                        <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="h-12 w-12 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-red-600 mb-4">
                            Pago no procesado
                        </h1>

                        <p className="text-muted-foreground mb-6">
                            Lo sentimos, no pudimos procesar tu pago. Esto puede deberse a fondos insuficientes,
                            datos incorrectos o un problema temporal.
                        </p>

                        {orderId && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-red-700">Tu pedido sigue guardado</p>
                                <p className="text-lg font-bold text-red-800">Orden: {orderId}</p>
                            </div>
                        )}

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                            <p className="font-semibold text-yellow-800 mb-2">¿Qué puedes hacer?</p>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Verifica que los datos de tu tarjeta sean correctos</li>
                                <li>• Asegúrate de tener fondos suficientes</li>
                                <li>• Intenta con otro método de pago</li>
                                <li>• Contacta a tu banco si el problema persiste</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <Button asChild className="w-full" size="lg">
                                <Link href="/checkout">
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Intentar de nuevo
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
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <HelpCircle className="h-4 w-4" />
                                ¿Necesitas ayuda? Escríbenos al chat de soporte
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function CheckoutFailurePage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <CheckoutFailureContent />
        </Suspense>
    );
}
