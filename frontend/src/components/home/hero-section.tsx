'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShoppingBag, Truck, Award } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 min-h-[600px]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2 text-sm font-medium text-white mb-8 border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Nueva temporada escolar 2025
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
              Tu papelería favorita
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                AKEMY
              </span>
            </h1>
            <p className="mt-8 text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Encuentra los mejores artículos de papelería, útiles escolares, libros
              y materiales de oficina con los mejores precios.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/productos">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-full px-8">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ver productos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ofertas">
                <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600 shadow-xl hover:shadow-2xl rounded-full px-8 transition-all duration-300">
                  🔥 Ver ofertas
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-white/80">
                <div className="p-2 rounded-full bg-white/10">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-sm">Envío gratis +S/500</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="p-2 rounded-full bg-white/10">
                  <Award className="h-4 w-4" />
                </div>
                <span className="text-sm">Garantía de calidad</span>
              </div>
            </div>
          </div>

          {/* Decorative cards */}
          <div className="relative hidden lg:block">
            <div className="relative h-[500px] w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Floating cards */}
                <div className="absolute top-0 left-1/4 w-48 h-60 rounded-3xl bg-white/90 backdrop-blur shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 p-4 flex flex-col justify-between">
                  <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100"></div>
                  <div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="absolute top-20 right-1/4 w-48 h-60 rounded-3xl bg-white/90 backdrop-blur shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 p-4 flex flex-col justify-between">
                  <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100"></div>
                  <div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="absolute bottom-10 left-1/3 w-56 h-72 rounded-3xl bg-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 p-5 flex flex-col justify-between z-10">
                  <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                  <div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-1/2 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
