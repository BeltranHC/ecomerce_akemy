'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
    email: z.string().email('Por favor ingresa un email válido'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function RecuperarContrasenaPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true);
        try {
            await authApi.forgotPassword(data.email);
            setIsEmailSent(true);
            toast.success('Te hemos enviado las instrucciones por correo');
        } catch (error: any) {
            // Siempre mostramos éxito para no revelar si el email existe
            setIsEmailSent(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Panel izquierdo - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#C84B4B] text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Elementos flotantes animados */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Lápices */}
                    <div className="absolute top-[10%] left-[10%] text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>✏️</div>
                    <div className="absolute top-[30%] right-[15%] text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>✏️</div>
                    {/* Cuadernos */}
                    <div className="absolute top-[50%] left-[5%] text-4xl animate-pulse" style={{ animationDelay: '1s' }}>📓</div>
                    <div className="absolute bottom-[30%] right-[10%] text-3xl animate-pulse" style={{ animationDelay: '1.5s' }}>📔</div>
                    {/* Reglas y tijeras */}
                    <div className="absolute top-[20%] right-[30%] text-3xl animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.8s' }}>📐</div>
                    <div className="absolute bottom-[20%] left-[20%] text-4xl animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '3.2s' }}>✂️</div>
                    {/* Más elementos */}
                    <div className="absolute top-[60%] right-[25%] text-3xl animate-pulse" style={{ animationDelay: '0.2s' }}>📎</div>
                    <div className="absolute bottom-[40%] left-[30%] text-4xl animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.6s' }}>🖍️</div>
                    <div className="absolute top-[40%] left-[25%] text-3xl animate-pulse" style={{ animationDelay: '0.8s' }}>📏</div>
                    <div className="absolute bottom-[15%] right-[35%] text-4xl animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '3s' }}>🔒</div>
                    {/* Círculos decorativos con animación */}
                    <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 border border-white/20 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <Image
                            src="/logoakemy.jpg"
                            alt="Librería Akemy"
                            width={180}
                            height={180}
                            className="drop-shadow-lg rounded-xl"
                        />
                    </Link>

                    <h1 className="text-4xl font-bold mb-4">
                        Recupera tu acceso
                    </h1>
                    <p className="text-red-100 text-lg">
                        No te preocupes, te ayudaremos a restablecer tu contraseña rápidamente.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                            <span className="text-2xl">📧</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Paso 1</h3>
                            <p className="text-red-100 text-sm">Ingresa tu correo electrónico</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                            <span className="text-2xl">🔗</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Paso 2</h3>
                            <p className="text-red-100 text-sm">Recibirás un enlace en tu correo</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                            <span className="text-2xl">🔐</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Paso 3</h3>
                            <p className="text-red-100 text-sm">Crea tu nueva contraseña</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-red-200">
                    © 2024 Librería AKEMY. Todos los derechos reservados.
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Logo móvil */}
                    <div className="lg:hidden text-center mb-8">
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

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {!isEmailSent ? (
                            <>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                        <Mail className="w-8 h-8 text-[#C84B4B]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">¿Olvidaste tu contraseña?</h2>
                                    <p className="text-gray-500 mt-2">
                                        Ingresa tu correo y te enviaremos las instrucciones
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 font-medium">
                                            Correo electrónico
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            className="h-12 border-gray-200 focus:border-[#C84B4B] focus:ring-[#C84B4B] rounded-xl"
                                            {...register('email')}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#C84B4B] hover:bg-[#a83e3e] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-400/30 hover:shadow-red-400/40"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            'Enviar instrucciones'
                                        )}
                                    </Button>

                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-2 text-gray-600 hover:text-[#C84B4B] font-medium transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Volver a iniciar sesión
                                    </Link>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Revisa tu correo!</h2>
                                <p className="text-gray-500 mb-6">
                                    Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
                                </p>
                                <p className="text-gray-400 text-sm mb-6">
                                    El enlace expirará en 1 hora.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#C84B4B] hover:bg-[#a83e3e] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-400/30 hover:shadow-red-400/40"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Volver a iniciar sesión
                                </Link>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        ¿Necesitas ayuda?{' '}
                        <Link href="/contacto" className="text-[#C84B4B] hover:underline">
                            Contáctanos
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
