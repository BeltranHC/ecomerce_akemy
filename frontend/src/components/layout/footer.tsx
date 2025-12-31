'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { settingsApi } from '@/lib/api';

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  freeShippingMinimum: string;
}

export function Footer() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'AKEMY',
    storeDescription: 'Tu papelería favorita. Encuentra los mejores artículos de papelería, útiles escolares, libros y más con la mejor calidad.',
    storeEmail: 'contacto@akemy.com',
    storePhone: '+51 926 465 929',
    storeAddress: 'Av. Principal 123, Lima, Perú',
    freeShippingMinimum: '100',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsApi.getPublic();
        const data = response.data || {};
        setSettings({
          storeName: data.storeName || 'AKEMY',
          storeDescription: data.storeDescription || 'Tu papelería favorita. Encuentra los mejores artículos de papelería, útiles escolares, libros y más con la mejor calidad.',
          storeEmail: data.storeEmail || 'contacto@akemy.com',
          storePhone: data.storePhone || '+51 926 465 929',
          storeAddress: data.storeAddress || 'Av. Principal 123, Lima, Perú',
          freeShippingMinimum: data.freeShippingMinimum || '100',
        });
      } catch {
        // Usar valores por defecto si hay error de conexión
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t">
      {/* Features Bar */}
      <div className="border-b bg-white">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Envío Gratis</p>
                <p className="text-xs text-muted-foreground">En compras +S/{settings.freeShippingMinimum}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Compra Segura</p>
                <p className="text-xs text-muted-foreground">100% protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Pago Fácil</p>
                <p className="text-xs text-muted-foreground">Múltiples métodos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Soporte 24/7</p>
                <p className="text-xs text-muted-foreground">Siempre contigo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="gradient-text text-3xl font-extrabold">
                {settings.storeName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {settings.storeDescription}
            </p>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Enlaces rápidos</h3>
            <ul className="space-y-3">
              {['Productos', 'Categorías', 'Ofertas', 'Nosotros'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Atención al cliente</h3>
            <ul className="space-y-3">
              {[
                { label: 'Mi cuenta', href: '/cuenta' },
                { label: 'Mis pedidos', href: '/cuenta/pedidos' },
                { label: 'Devoluciones', href: '/devoluciones' },
                { label: 'FAQ', href: '/faq' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground pt-1">
                  {settings.storeAddress}
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {settings.storePhone}
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {settings.storeEmail}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} <span className="font-semibold gradient-text">{settings.storeName}</span>. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                Desarrollado con <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> por <a href="https://beltranhc.github.io/portafolio/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">JuniDev</a>
              </span>
              <Link
                href="/terminos"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Términos y condiciones
              </Link>
              <Link
                href="/privacidad"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Política de privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
