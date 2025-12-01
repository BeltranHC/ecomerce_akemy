'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Award, Shield } from 'lucide-react';

const banners = [
  {
    id: 1,
    image: '/banners/baner.png',
  },
  {
    id: 2,
    image: '/banners/benner2.png',
  },
  {
    id: 3,
    image: '/banners/baner3.png',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF5F3] to-[#F9EEEB]">
      {/* Main Carousel */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[550px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0 z-10' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full z-0'
                  : 'opacity-0 translate-x-full z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.image}
                alt={`Banner ${banner.id}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 group"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all duration-300 hover:scale-110 group"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-10 h-3 bg-[#C84B4B]' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-[#C84B4B] to-[#a83e3e] py-5 shadow-lg">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center gap-3 group">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="font-semibold text-white">Gran Variedad</p>
                <p className="text-sm text-white/80">+1000 productos</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 group">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Calidad Premium</p>
                <p className="text-sm text-white/80">Mejores marcas</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 group">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Compra Segura</p>
                <p className="text-sm text-white/80">100% confiable</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 group">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="font-semibold text-white">Mejores Precios</p>
                <p className="text-sm text-white/80">Ofertas diarias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
