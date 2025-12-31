import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, Shield, Scale, AlertTriangle, CreditCard, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Términos y Condiciones - AKEMY',
    description: 'Términos y condiciones de uso de AKEMY',
};

export default function TerminosPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="container-custom py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Términos y Condiciones</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Al utilizar nuestro sitio web y servicios, aceptas cumplir con estos términos y condiciones.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Última actualización: Diciembre 2024
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Aceptación */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">1. Aceptación de los Términos</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Al acceder y utilizar el sitio web de AKEMY, usted acepta estar sujeto a estos
                                            términos y condiciones. Si no está de acuerdo, le rogamos no utilice nuestros servicios.
                                            Nos reservamos el derecho de modificar estos términos en cualquier momento.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Uso del sitio */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">2. Uso del Sitio</h2>
                                        <ul className="space-y-2 text-muted-foreground text-sm">
                                            <li>• Proporcionar información veraz y actualizada al registrarse o comprar.</li>
                                            <li>• No utilizar el sitio para fines ilegales o no autorizados.</li>
                                            <li>• Mantener la confidencialidad de su cuenta y contraseña.</li>
                                            <li>• No reproducir o revender contenido sin autorización.</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Productos y precios */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                        <Scale className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">3. Productos y Precios</h2>
                                        <ul className="space-y-2 text-muted-foreground text-sm">
                                            <li><strong>Disponibilidad:</strong> Sujeta a stock. Podemos limitar cantidades sin previo aviso.</li>
                                            <li><strong>Precios:</strong> En Soles (S/) con IGV incluido. Pueden modificarse sin previo aviso.</li>
                                            <li><strong>Imágenes:</strong> Son referenciales. Pueden existir variaciones en color o empaque.</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagos */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                        <CreditCard className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">4. Métodos de Pago</h2>
                                        <p className="text-muted-foreground text-sm mb-2">Aceptamos:</p>
                                        <ul className="space-y-1 text-muted-foreground text-sm">
                                            <li>• Pago en efectivo al momento de la entrega</li>
                                            <li>• Transferencia bancaria</li>
                                            <li>• Tarjetas de débito y crédito (próximamente)</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Envíos */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                        <Truck className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">5. Envíos y Entregas</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Los tiempos de entrega son estimados y pueden variar. No nos hacemos responsables por
                                            retrasos de terceros o causas de fuerza mayor. Es responsabilidad del cliente proporcionar
                                            una dirección correcta y completa.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Devoluciones */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                                        <RotateCcw className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">6. Devoluciones y Cambios</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Aceptamos devoluciones dentro de los <strong>10 días calendario</strong> posteriores a la
                                            recepción, siempre que el producto esté sin uso y en su empaque original.
                                            Consulta nuestra <Link href="/devoluciones" className="text-primary hover:underline">Política de Devoluciones</Link> para más detalles.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Limitación */}
                        <Card className="border-yellow-200 bg-yellow-50/50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">7. Limitación de Responsabilidad</h2>
                                        <p className="text-muted-foreground text-sm">
                                            AKEMY no será responsable por daños directos, indirectos o consecuentes que resulten del
                                            uso del sitio web o productos. El sitio se proporciona "tal cual" sin garantías expresas o implícitas.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ley aplicable */}
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-lg font-semibold mb-2">8. Ley Aplicable</h2>
                                <p className="text-muted-foreground text-sm">
                                    Estos términos se rigen por las leyes de la República del Perú.
                                    Cualquier disputa será sometida a los tribunales de Lima, Perú.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Contacto */}
                        <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
                            <CardContent className="pt-6 text-center">
                                <h2 className="text-lg font-semibold mb-2">¿Tienes alguna pregunta?</h2>
                                <p className="text-muted-foreground text-sm">
                                    Escríbenos a <a href="mailto:noreply@akemy.app" className="text-primary hover:underline">noreply@akemy.app</a>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
