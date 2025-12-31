import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Database, Cookie, Share2, UserCheck, Mail, Shield } from 'lucide-react';

export const metadata = {
    title: 'Política de Privacidad - AKEMY',
    description: 'Política de privacidad y protección de datos de AKEMY',
};

export default function PrivacidadPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="container-custom py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Tu privacidad es importante para nosotros. Aquí te explicamos cómo recopilamos,
                            usamos y protegemos tu información personal.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Última actualización: Diciembre 2024
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Información que recopilamos */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                        <Database className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">1. Información que Recopilamos</h2>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            Recopilamos información que usted nos proporciona directamente:
                                        </p>
                                        <ul className="space-y-1 text-muted-foreground text-sm">
                                            <li>• Nombre completo y datos de contacto (email, teléfono)</li>
                                            <li>• Dirección de envío para procesar pedidos</li>
                                            <li>• Historial de compras y preferencias</li>
                                            <li>• Información de navegación (cookies)</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Uso de la información */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                        <UserCheck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">2. Uso de la Información</h2>
                                        <p className="text-muted-foreground text-sm mb-2">Utilizamos tu información para:</p>
                                        <ul className="space-y-1 text-muted-foreground text-sm">
                                            <li>• Procesar y entregar tus pedidos</li>
                                            <li>• Enviar confirmaciones de compra y actualizaciones de estado</li>
                                            <li>• Responder a tus consultas y solicitudes de soporte</li>
                                            <li>• Mejorar nuestros servicios y experiencia de usuario</li>
                                            <li>• Enviar ofertas y promociones (si diste tu consentimiento)</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Protección de datos */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                        <Shield className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">3. Protección de Datos</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
                                            personal contra acceso no autorizado, alteración, divulgación o destrucción. Usamos
                                            conexiones seguras (HTTPS) y encriptación de datos sensibles.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cookies */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                        <Cookie className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">4. Cookies</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Utilizamos cookies y tecnologías similares para mejorar tu experiencia de navegación,
                                            mantener tu sesión activa, analizar el tráfico del sitio y personalizar el contenido.
                                            Puedes configurar tu navegador para rechazar cookies, pero algunas funciones del sitio
                                            podrían no funcionar correctamente.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Compartir información */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                        <Share2 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">5. Compartir Información</h2>
                                        <p className="text-muted-foreground text-sm">
                                            <strong>No vendemos ni compartimos tu información personal con terceros</strong>, excepto cuando
                                            sea necesario para:
                                        </p>
                                        <ul className="space-y-1 text-muted-foreground text-sm mt-2">
                                            <li>• Procesar tus pedidos (empresas de envío)</li>
                                            <li>• Procesar pagos (pasarelas de pago)</li>
                                            <li>• Cuando la ley lo requiera</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tus derechos */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                                        <UserCheck className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">6. Tus Derechos</h2>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            De acuerdo con la Ley de Protección de Datos Personales, tienes derecho a:
                                        </p>
                                        <ul className="space-y-1 text-muted-foreground text-sm">
                                            <li>• <strong>Acceder</strong> a tus datos personales</li>
                                            <li>• <strong>Rectificar</strong> información incorrecta</li>
                                            <li>• <strong>Eliminar</strong> tus datos de nuestra base</li>
                                            <li>• <strong>Oponerte</strong> al uso de tus datos para marketing</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contacto */}
                        <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">7. Contacto</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Si tienes preguntas sobre esta política o deseas ejercer tus derechos, contáctanos:
                                        </p>
                                        <p className="text-sm mt-2">
                                            📧 <a href="mailto:noreply@akemy.app" className="text-primary hover:underline">noreply@akemy.app</a>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
