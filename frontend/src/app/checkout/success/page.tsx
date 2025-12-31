'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Confetti from 'react-confetti';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order');
    const paymentId = searchParams.get('payment_id');
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
            <main className="flex-1 flex items-center justify-center py-12">
                <div className="container-custom max-w-lg">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        {/* Success Icon */}
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="h-12 w-12 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-green-600 mb-4">
                            ¡Pago Exitoso!
                        </h1>

                        <p className="text-muted-foreground mb-6">
                            Tu pago ha sido procesado correctamente. Recibirás un correo electrónico con los detalles de tu pedido.
                        </p>

                        {orderId && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-green-700">Número de pedido</p>
                                <p className="text-xl font-bold text-green-800">{orderId}</p>
                                {paymentId && (
                                    <p className="text-xs text-green-600 mt-1">ID Pago: {paymentId}</p>
                                )}
                            </div>
                        )}

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
                                ¿Tienes alguna pregunta? Contáctanos a través del{' '}
                                <Link href="/" className="text-primary hover:underline">
                                    chat de soporte
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
