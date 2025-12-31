'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio
                    </Button>
                </Link>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Términos de Servicio
                    </h1>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 mb-4">
                            Última actualización: Diciembre 2024
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            1. Aceptación de los Términos
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Al acceder y utilizar el sitio web de Librería AKEMY, usted acepta
                            estar sujeto a estos términos de servicio, todas las leyes y
                            regulaciones aplicables, y acepta que es responsable del
                            cumplimiento de las leyes locales aplicables.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            2. Uso del Sitio
                        </h2>
                        <p className="text-gray-600 mb-4">
                            El contenido de las páginas de este sitio web es para su
                            información general y uso únicamente. Está sujeto a cambios sin
                            previo aviso.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            3. Productos y Precios
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Nos reservamos el derecho de modificar los precios de nuestros
                            productos sin previo aviso. Las imágenes de los productos son
                            ilustrativas y pueden variar del producto real.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            4. Compras y Pagos
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Al realizar una compra, usted garantiza que la información
                            proporcionada es verdadera y exacta. Nos reservamos el derecho de
                            cancelar pedidos si detectamos información fraudulenta.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            5. Envíos y Entregas
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Los tiempos de entrega son estimados y pueden variar según la
                            ubicación y disponibilidad del producto. No nos hacemos
                            responsables por retrasos causados por terceros.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            6. Devoluciones
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Aceptamos devoluciones dentro de los 7 días posteriores a la
                            compra, siempre que el producto esté en su empaque original y sin
                            uso.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            7. Contacto
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Para cualquier consulta sobre estos términos, puede contactarnos a
                            través de nuestros canales de atención al cliente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
