import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ChatWidget } from '@/components/chat/chat-widget';
import { Building2, Users, Award, Heart, Leaf, Truck, Target, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre AKEMY</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Tu tienda de confianza en productos de papelería, útiles escolares y artículos de oficina. 
              Más de 10 años llevando calidad, variedad y los mejores precios a estudiantes, 
              profesionales y empresas.
            </p>
          </div>
        </div>

        {/* Historia */}
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                <strong className="text-foreground">AKEMY</strong> nació en 2014 con un sueño simple pero ambicioso: 
                convertirse en el destino preferido para todos aquellos que buscan productos de papelería 
                y útiles escolares de la más alta calidad. Lo que comenzó como una pequeña tienda familiar, 
                hoy se ha transformado en una empresa reconocida por su compromiso con la excelencia.
              </p>
              <p>
                A lo largo de los años, hemos crecido junto a nuestros clientes, adaptándonos a sus 
                necesidades y expandiendo nuestro catálogo para incluir desde los clásicos cuadernos 
                y lápices hasta las herramientas más innovadoras para la oficina moderna. Cada producto 
                que ofrecemos es cuidadosamente seleccionado para garantizar durabilidad, funcionalidad 
                y el mejor valor por tu dinero.
              </p>
              <p>
                Hoy, con nuestra tienda en línea, llevamos la experiencia AKEMY a todo el país, 
                manteniendo los mismos valores que nos han distinguido desde el primer día: 
                <strong className="text-foreground"> honestidad, calidad y un servicio al cliente excepcional</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-muted/30 py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-card border rounded-2xl p-8 shadow-sm">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Facilitar el acceso a productos de papelería, útiles escolares y artículos de oficina 
                  de alta calidad, contribuyendo al desarrollo educativo y profesional de nuestra comunidad. 
                  Nos esforzamos por ofrecer una experiencia de compra excepcional, con precios justos, 
                  amplia variedad y un servicio que supere las expectativas de nuestros clientes.
                </p>
              </div>
              <div className="bg-card border rounded-2xl p-8 shadow-sm">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ser la empresa líder en el mercado de papelería y útiles de oficina, reconocida 
                  a nivel nacional por nuestra innovación, calidad de productos y compromiso con 
                  la satisfacción del cliente. Aspiramos a ser el primer nombre que viene a la mente 
                  cuando alguien piensa en equipar su escuela, hogar u oficina.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-4">Nuestros Valores</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Estos principios guían cada decisión que tomamos y cada interacción con nuestros clientes
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Compromiso</h3>
                <p className="text-sm text-muted-foreground">
                  Nos comprometemos con cada cliente para brindar la mejor experiencia de compra posible
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Calidad</h3>
                <p className="text-sm text-muted-foreground">
                  Seleccionamos cuidadosamente cada producto, trabajando solo con marcas reconocidas
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Servicio</h3>
                <p className="text-sm text-muted-foreground">
                  Atención personalizada y soporte continuo porque tu satisfacción es nuestra prioridad
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Sostenibilidad</h3>
                <p className="text-sm text-muted-foreground">
                  Comprometidos con el medio ambiente, promovemos productos eco-amigables
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-muted/30 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-4">¿Por qué elegirnos?</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Miles de clientes confían en nosotros. Descubre lo que nos hace diferentes
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start gap-4 bg-card p-6 rounded-2xl border">
                <div className="bg-primary/10 rounded-xl p-3 flex-shrink-0">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Envío Rápido y Seguro</h3>
                  <p className="text-sm text-muted-foreground">
                    Entrega en 24-48 horas en Lima y envíos a todo el Perú. 
                    Tu pedido llegará perfectamente empacado y protegido.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card p-6 rounded-2xl border">
                <div className="bg-primary/10 rounded-xl p-3 flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Marcas de Confianza</h3>
                  <p className="text-sm text-muted-foreground">
                    Trabajamos con las mejores marcas: Faber-Castell, Artesco, Stabilo, 
                    3M, y muchas más para garantizar calidad.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card p-6 rounded-2xl border">
                <div className="bg-primary/10 rounded-xl p-3 flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Atención Personalizada</h3>
                  <p className="text-sm text-muted-foreground">
                    Nuestro equipo está disponible para asesorarte y ayudarte 
                    a encontrar exactamente lo que necesitas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card p-6 rounded-2xl border">
                <div className="bg-primary/10 rounded-xl p-3 flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Compra las 24/7</h3>
                  <p className="text-sm text-muted-foreground">
                    Nuestra tienda online está disponible las 24 horas, los 7 días 
                    de la semana. Compra cuando quieras, desde donde quieras.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card p-6 rounded-2xl border">
                <div className="bg-primary/10 rounded-xl p-3 flex-shrink-0">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Compra Segura</h3>
                  <p className="text-sm text-muted-foreground">
                    Tus datos están protegidos. Ofrecemos múltiples métodos de pago 
                    seguros y garantía en todos nuestros productos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-card p-6 rounded-2xl border">
                <div className="bg-primary/10 rounded-xl p-3 flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Precios Competitivos</h3>
                  <p className="text-sm text-muted-foreground">
                    Los mejores precios del mercado con ofertas y promociones 
                    exclusivas para nuestros clientes frecuentes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container-custom py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Años de experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Clientes satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2000+</div>
              <div className="text-sm text-muted-foreground">Productos disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Marcas aliadas</div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
            <p className="mb-8 opacity-90 max-w-2xl mx-auto text-lg">
              Explora nuestro catálogo con miles de productos de papelería, útiles escolares 
              y artículos de oficina. ¡Encuentra todo lo que necesitas en un solo lugar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/productos"
                className="inline-flex items-center justify-center rounded-md bg-white text-primary px-8 py-3 font-medium hover:bg-white/90 transition-colors"
              >
                Ver Productos
              </a>
              <a
                href="mailto:contacto@akemy.com"
                className="inline-flex items-center justify-center rounded-md border-2 border-white text-white px-8 py-3 font-medium hover:bg-white/10 transition-colors"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  );
}
