'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
            'Debe contener al menos una mayúscula, una minúscula y un número'
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) {
            setError('Token de recuperación no válido');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authApi.resetPassword({ token, password: data.password });
            setIsSuccess(true);
            toast.success('¡Contraseña actualizada exitosamente!');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al restablecer la contraseña';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Si no hay token, mostrar error
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Enlace inválido</h2>
                    <p className="text-gray-500 mb-6">
                        El enlace de recuperación no es válido o ha expirado. Por favor solicita uno nuevo.
                    </p>
                    <Link
                        href="/recuperar-contrasena"
                        className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#C84B4B] hover:bg-[#a83e3e] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-400/30 hover:shadow-red-400/40"
                    >
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Panel izquierdo - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#C84B4B] text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Elementos flotantes animados */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🔐</div>
                    <div className="absolute top-[30%] right-[15%] text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>🔑</div>
                    <div className="absolute top-[50%] left-[5%] text-4xl animate-pulse" style={{ animationDelay: '1s' }}>📓</div>
                    <div className="absolute bottom-[30%] right-[10%] text-3xl animate-pulse" style={{ animationDelay: '1.5s' }}>📔</div>
                    <div className="absolute top-[20%] right-[30%] text-3xl animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.8s' }}>✏️</div>
                    <div className="absolute bottom-[20%] left-[20%] text-4xl animate-bounce" style={{ animationDelay: '0.7s', animationDuration: '3.2s' }}>✂️</div>
                    <div className="absolute top-[60%] right-[25%] text-3xl animate-pulse" style={{ animationDelay: '0.2s' }}>🛡️</div>
                    <div className="absolute bottom-[40%] left-[30%] text-4xl animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.6s' }}>🖍️</div>
                    <div className="absolute top-[40%] left-[25%] text-3xl animate-pulse" style={{ animationDelay: '0.8s' }}>📏</div>
                    <div className="absolute bottom-[15%] right-[35%] text-4xl animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '3s' }}>🎨</div>
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
                        Crea tu nueva contraseña
                    </h1>
                    <p className="text-red-100 text-lg">
                        Elige una contraseña segura para proteger tu cuenta.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                            <span className="text-2xl">8️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Mínimo 8 caracteres</h3>
                            <p className="text-red-100 text-sm">Tu contraseña debe ser larga</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                            <span className="text-2xl">🔤</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Mayúsculas y minúsculas</h3>
                            <p className="text-red-100 text-sm">Combina diferentes tipos de letras</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                            <span className="text-2xl">🔢</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Al menos un número</h3>
                            <p className="text-red-100 text-sm">Incluye dígitos para más seguridad</p>
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
                        {!isSuccess ? (
                            <>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                        <Lock className="w-8 h-8 text-[#C84B4B]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Nueva contraseña</h2>
                                    <p className="text-gray-500 mt-2">
                                        Ingresa y confirma tu nueva contraseña
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-700 font-medium">
                                            Nueva contraseña
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="h-12 border-gray-200 focus:border-[#C84B4B] focus:ring-[#C84B4B] rounded-xl pr-12"
                                                {...register('password')}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-500">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                            Confirmar contraseña
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="h-12 border-gray-200 focus:border-[#C84B4B] focus:ring-[#C84B4B] rounded-xl pr-12"
                                                {...register('confirmPassword')}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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
                                                Actualizando...
                                            </>
                                        ) : (
                                            'Actualizar contraseña'
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h2>
                                <p className="text-gray-500 mb-6">
                                    Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Redirigiendo...
                                </div>
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

export default function RestablecerContrasenaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#C84B4B]" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
