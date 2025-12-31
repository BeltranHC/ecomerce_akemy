'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const faqCategories = [
    {
        name: 'Pedidos y Compras',
        items: [
            {
                question: '¿Cómo puedo realizar un pedido?',
                answer: 'Puedes realizar tu pedido directamente desde nuestra tienda online. Simplemente agrega los productos a tu carrito, completa tus datos de entrega y selecciona tu método de pago. Recibirás una confirmación por correo electrónico.',
            },
            {
                question: '¿Cuáles son los métodos de pago disponibles?',
                answer: 'Aceptamos pagos en efectivo al momento de la entrega, transferencias bancarias y pagos con tarjeta de débito/crédito. Pronto habilitaremos más opciones de pago.',
            },
            {
                question: '¿Puedo modificar o cancelar mi pedido?',
                answer: 'Puedes modificar o cancelar tu pedido siempre que no haya sido despachado. Contáctanos lo antes posible a través del chat de soporte para gestionar cualquier cambio.',
            },
            {
                question: '¿Cómo sé si mi pedido fue confirmado?',
                answer: 'Una vez realizado tu pedido, recibirás un correo electrónico de confirmación con los detalles de tu compra y un número de pedido. También puedes verificar el estado en la sección "Mis pedidos" de tu cuenta.',
            },
        ],
    },
    {
        name: 'Envíos y Entregas',
        items: [
            {
                question: '¿Cuánto tiempo tarda mi pedido en llegar?',
                answer: 'El tiempo de entrega depende de tu ubicación. Para Lima Metropolitana, el envío es de 1-3 días hábiles. Para provincias, puede tomar de 3-7 días hábiles.',
            },
            {
                question: '¿Cuánto cuesta el envío?',
                answer: 'El costo de envío varía según tu ubicación. Para compras mayores a S/ 100, el envío es GRATIS a Lima Metropolitana. Puedes ver el costo exacto al momento de finalizar tu compra.',
            },
            {
                question: '¿Hacen envíos a todo el Perú?',
                answer: 'Sí, realizamos envíos a todo el Perú a través de empresas de courier de confianza. El tiempo y costo de envío varía según el destino.',
            },
            {
                question: '¿Puedo recoger mi pedido en tienda?',
                answer: 'Sí, ofrecemos la opción de recojo en tienda sin costo adicional. Al finalizar tu compra, selecciona "Recojo en tienda" y te notificaremos cuando tu pedido esté listo.',
            },
        ],
    },
    {
        name: 'Devoluciones y Cambios',
        items: [
            {
                question: '¿Cuál es el plazo para hacer una devolución?',
                answer: 'Tienes 10 días calendario desde la recepción de tu pedido para solicitar una devolución o cambio. El producto debe estar sin usar y en su empaque original.',
            },
            {
                question: '¿Cómo solicito una devolución?',
                answer: 'Contáctanos a través del chat de soporte o envía un correo a noreply@akemy.app con tu número de pedido y el motivo de la devolución. Te guiaremos en el proceso.',
            },
            {
                question: '¿Cuánto demora el reembolso?',
                answer: 'Una vez recibido y verificado el producto, procesaremos tu reembolso en un plazo de 5-7 días hábiles. El tiempo puede variar según tu banco.',
            },
        ],
    },
    {
        name: 'Mi Cuenta',
        items: [
            {
                question: '¿Cómo creo una cuenta?',
                answer: 'Haz clic en "Iniciar sesión" en la parte superior de la página y luego selecciona "Crear cuenta". Completa el formulario con tus datos y recibirás un correo de verificación.',
            },
            {
                question: '¿Olvidé mi contraseña, qué hago?',
                answer: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Te enviaremos un correo con instrucciones para restablecerla.',
            },
            {
                question: '¿Cómo puedo ver mi historial de pedidos?',
                answer: 'Inicia sesión en tu cuenta y ve a "Mi cuenta" > "Mis pedidos". Allí podrás ver todos tus pedidos anteriores y su estado actual.',
            },
        ],
    },
    {
        name: 'Productos',
        items: [
            {
                question: '¿Los productos tienen garantía?',
                answer: 'Sí, todos nuestros productos tienen garantía por defectos de fábrica. El plazo de garantía varía según el tipo de producto y la marca.',
            },
            {
                question: '¿Cómo sé si un producto está disponible?',
                answer: 'La disponibilidad se muestra en cada página de producto. Si aparece "En stock", el producto está disponible para compra inmediata.',
            },
            {
                question: '¿Puedo solicitar un producto que no encuentro?',
                answer: 'Sí, contáctanos por el chat de soporte y trataremos de conseguir el producto que necesitas. Haremos lo posible por ayudarte.',
            },
        ],
    },
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleItem = (id: string) => {
        setOpenItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const filteredCategories = faqCategories.map((category) => ({
        ...category,
        items: category.items.filter(
            (item) =>
                item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    })).filter((category) => category.items.length > 0);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="container-custom py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <HelpCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Encuentra respuestas a las preguntas más comunes sobre nuestros productos,
                            envíos, devoluciones y más.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar una pregunta..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* FAQ List */}
                    <div className="max-w-3xl mx-auto space-y-8">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No se encontraron resultados para "{searchTerm}"
                            </div>
                        ) : (
                            filteredCategories.map((category) => (
                                <div key={category.name}>
                                    <h2 className="text-xl font-semibold mb-4 text-primary">{category.name}</h2>
                                    <div className="space-y-3">
                                        {category.items.map((item, index) => {
                                            const itemId = `${category.name}-${index}`;
                                            const isOpen = openItems.includes(itemId);

                                            return (
                                                <div
                                                    key={itemId}
                                                    className="border rounded-lg overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(itemId)}
                                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                                                    >
                                                        <span className="font-medium pr-4">{item.question}</span>
                                                        {isOpen ? (
                                                            <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                        )}
                                                    </button>
                                                    {isOpen && (
                                                        <div className="px-4 pb-4 text-muted-foreground">
                                                            {item.answer}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Contact CTA */}
                    <div className="max-w-3xl mx-auto mt-12 text-center p-8 bg-muted/30 rounded-xl">
                        <h3 className="text-lg font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
                        <p className="text-muted-foreground mb-4">
                            Nuestro equipo de soporte está listo para ayudarte.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Escríbenos por el chat de soporte o a noreply@akemy.app
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
