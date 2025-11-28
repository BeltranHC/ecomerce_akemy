import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Building2, Users, Award, Heart, Leaf, Truck } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container-custom text-center">
            <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Somos tu aliado en productos de papelería, oficina y escuela. 
              Comprometidos con la calidad y el mejor servicio.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="container-custom py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card border rounded-lg p-8">
              <Building2 className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-muted-foreground">
                Proveer productos de alta calidad para oficina, escuela y hogar, 
                facilitando el acceso a herramientas que impulsen la productividad 
                y creatividad de nuestros clientes, siempre con un servicio excepcional.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-8">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
              <p className="text-muted-foreground">
                Ser la tienda líder en productos de papelería y oficina, reconocida 
                por nuestra variedad, calidad y compromiso con la satisfacción del cliente, 
                expandiendo nuestra presencia en toda la región.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-muted/50 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Nuestros Valores</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Compromiso</h3>
                <p className="text-sm text-muted-foreground">
                  Nos comprometemos con cada cliente para brindar la mejor experiencia
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Calidad</h3>
                <p className="text-sm text-muted-foreground">
                  Seleccionamos cuidadosamente cada producto que ofrecemos
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Servicio</h3>
                <p className="text-sm text-muted-foreground">
                  Atención personalizada y soporte continuo a nuestros clientes
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Responsabilidad</h3>
                <p className="text-sm text-muted-foreground">
                  Comprometidos con el medio ambiente y prácticas sostenibles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="container-custom py-16">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Envío Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Entregamos tu pedido en tiempo récord para que siempre tengas lo que necesitas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Productos de Marca</h3>
                <p className="text-sm text-muted-foreground">
                  Trabajamos con las mejores marcas del mercado para garantizar calidad.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Atención Personalizada</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestro equipo está disponible para ayudarte en todo momento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary text-white py-12">
          <div className="container-custom text-center">
            <h2 className="text-2xl font-bold mb-4">¿Tienes alguna pregunta?</h2>
            <p className="mb-6 opacity-90">
              Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
            </p>
            <a
              href="mailto:contacto@akemy.com"
              className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 py-3 font-medium hover:bg-white/90 transition-colors"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
