'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacidadPage() {
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
                        Política de Privacidad
                    </h1>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 mb-4">
                            Última actualización: Diciembre 2024
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            1. Información que Recopilamos
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Recopilamos información que usted nos proporciona directamente,
                            como su nombre, correo electrónico, dirección de envío y datos de
                            pago al realizar una compra.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            2. Uso de la Información
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Utilizamos su información para:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 mb-4">
                            <li>Procesar y entregar sus pedidos</li>
                            <li>Enviar confirmaciones de compra y actualizaciones</li>
                            <li>Responder a sus consultas y solicitudes</li>
                            <li>Mejorar nuestros servicios y experiencia de usuario</li>
                            <li>Enviar ofertas y promociones (si ha dado su consentimiento)</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            3. Protección de Datos
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Implementamos medidas de seguridad técnicas y organizativas para
                            proteger su información personal contra acceso no autorizado,
                            alteración, divulgación o destrucción.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            4. Cookies
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Utilizamos cookies y tecnologías similares para mejorar su
                            experiencia de navegación, analizar el tráfico del sitio y
                            personalizar el contenido.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            5. Compartir Información
                        </h2>
                        <p className="text-gray-600 mb-4">
                            No vendemos ni compartimos su información personal con terceros,
                            excepto cuando sea necesario para procesar sus pedidos (como
                            empresas de envío) o cuando la ley lo requiera.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            6. Sus Derechos
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Usted tiene derecho a acceder, rectificar o eliminar su
                            información personal. Puede ejercer estos derechos contactándonos
                            directamente.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            7. Contacto
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Si tiene preguntas sobre nuestra política de privacidad, puede
                            contactarnos a través de nuestros canales de atención al cliente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
