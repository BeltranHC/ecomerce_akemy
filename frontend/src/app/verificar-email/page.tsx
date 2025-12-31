'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired' | 'no-token';

function VerificarEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<VerificationStatus>('loading');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus('no-token');
            setMessage('No se proporcionó un token de verificación.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await authApi.verifyEmail(token);
                setStatus('success');
                setMessage(response.data.message || '¡Tu correo ha sido verificado exitosamente!');
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Error al verificar el correo';

                if (errorMessage.includes('expirado')) {
                    setStatus('expired');
                } else {
                    setStatus('error');
                }
                setMessage(errorMessage);
            }
        };

        verifyEmail();
    }, [token]);

    const handleResendEmail = async () => {
        if (!email) {
            toast.error('Por favor ingresa tu correo electrónico');
            return;
        }

        setIsResending(true);
        try {
            const response = await authApi.resendVerificationEmail(email);
            toast.success(response.data.message || 'Si el correo existe, recibirás un enlace de verificación');
            setEmail('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al enviar el correo');
        } finally {
            setIsResending(false);
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando tu correo...</h2>
                        <p className="text-gray-500">Por favor espera un momento</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Correo verificado!</h2>
                        <p className="text-gray-500 mb-6">{message}</p>
                        <Button
                            onClick={() => router.push('/login')}
                            className="w-full h-12 bg-[#C84B4B] hover:bg-[#a83e3e] text-white font-semibold rounded-xl"
                        >
                            Iniciar sesión
                        </Button>
                    </div>
                );

            case 'expired':
                return (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                            <RefreshCw className="w-10 h-10 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enlace expirado</h2>
                        <p className="text-gray-500 mb-6">El enlace de verificación ha expirado. Solicita uno nuevo ingresando tu correo:</p>

                        <div className="space-y-4">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-gray-200 focus:border-[#C84B4B] focus:ring-[#C84B4B] rounded-xl"
                                />
                            </div>

                            <Button
                                onClick={handleResendEmail}
                                disabled={isResending}
                                className="w-full h-12 bg-[#C84B4B] hover:bg-[#a83e3e] text-white font-semibold rounded-xl"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-5 w-5" />
                                        Reenviar enlace
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                );

            case 'error':
            case 'no-token':
                return (
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de verificación</h2>
                        <p className="text-gray-500 mb-6">{message}</p>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                                ¿Necesitas un nuevo enlace de verificación?
                            </p>

                            <div className="space-y-2 text-left">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-gray-200 focus:border-[#C84B4B] focus:ring-[#C84B4B] rounded-xl"
                                />
                            </div>

                            <Button
                                onClick={handleResendEmail}
                                disabled={isResending}
                                className="w-full h-12 bg-[#C84B4B] hover:bg-[#a83e3e] text-white font-semibold rounded-xl"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-5 w-5" />
                                        Enviar nuevo enlace
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/logoakemy.jpg"
                            alt="Librería Akemy"
                            width={120}
                            height={120}
                            className="mx-auto rounded-xl"
                        />
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {renderContent()}
                </div>

                {/* Footer links */}
                <div className="text-center mt-6 space-y-2">
                    <Link
                        href="/login"
                        className="text-[#C84B4B] hover:text-[#a83e3e] text-sm font-medium hover:underline"
                    >
                        Volver al inicio de sesión
                    </Link>
                    <p className="text-gray-400 text-xs">
                        ¿Tienes problemas? Contáctanos en{' '}
                        <a href="mailto:soporte@akemy.com" className="text-[#C84B4B]">
                            soporte@akemy.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VerificarEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#C84B4B] mx-auto mb-4" />
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </div>
        }>
            <VerificarEmailContent />
        </Suspense>
    );
}
