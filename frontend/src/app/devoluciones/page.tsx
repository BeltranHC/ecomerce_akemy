import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Clock, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const metadata = {
    title: 'Política de Devoluciones',
    description: 'Conoce nuestra política de devoluciones y cambios en AKEMY',
};

export default function DevolucionesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="container-custom py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <RotateCcw className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Política de Devoluciones y Cambios</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            En AKEMY nos preocupamos por tu satisfacción. Si no estás conforme con tu compra,
                            aquí te explicamos cómo realizar devoluciones o cambios.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Plazo */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Plazo para Devoluciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>
                                    Tienes <strong className="text-primary">10 días calendario</strong> desde la fecha de recepción
                                    de tu pedido para solicitar una devolución o cambio.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Pasado este plazo, lamentablemente no podremos procesar tu solicitud.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Condiciones */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Condiciones para Devoluciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span>El producto debe estar <strong>sin usar</strong> y en su empaque original.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span>Debe conservar todas las etiquetas y precintos de seguridad.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span>Debes presentar tu comprobante de compra (boleta o factura).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                        <span>Los productos deben estar en perfectas condiciones, sin daños ni alteraciones.</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Productos no aceptados */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    Productos que NO Aceptamos en Devolución
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                                        <span>Productos usados, dañados o con signos de maltrato.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                                        <span>Artículos sin empaque original o con empaques deteriorados.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                                        <span>Productos en oferta o liquidación (salvo defectos de fábrica).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                                        <span>Libros, cuadernos o productos personalizados.</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Proceso */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    ¿Cómo Solicitar una Devolución?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-4">
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</span>
                                        <div>
                                            <strong>Contacta con nosotros</strong>
                                            <p className="text-sm text-muted-foreground">Escríbenos por el chat de soporte o envía un correo a noreply@akemy.app</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</span>
                                        <div>
                                            <strong>Indica tu número de pedido</strong>
                                            <p className="text-sm text-muted-foreground">Proporciona el número de pedido y el motivo de la devolución.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</span>
                                        <div>
                                            <strong>Coordina la entrega</strong>
                                            <p className="text-sm text-muted-foreground">Te indicaremos cómo y dónde entregar el producto.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">4</span>
                                        <div>
                                            <strong>Recibe tu reembolso o cambio</strong>
                                            <p className="text-sm text-muted-foreground">Una vez verificado el producto, procesaremos tu solicitud en 5-7 días hábiles.</p>
                                        </div>
                                    </li>
                                </ol>
                            </CardContent>
                        </Card>

                        {/* Importante */}
                        <Card className="border-yellow-200 bg-yellow-50/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-700">
                                    <AlertCircle className="h-5 w-5" />
                                    Importante
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-yellow-800">
                                <ul className="space-y-2 text-sm">
                                    <li>• El costo de envío por devolución corre por cuenta del cliente, excepto en casos de productos defectuosos.</li>
                                    <li>• Los reembolsos se realizarán por el mismo método de pago utilizado en la compra.</li>
                                    <li>• En caso de cambio, la diferencia de precio (si aplica) será cobrada o devuelta según corresponda.</li>
                                    <li>• AKEMY se reserva el derecho de rechazar devoluciones que no cumplan con las condiciones establecidas.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
