'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, User, X, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore, useUIStore, useAuthStore, useWishlistStore } from '@/lib/store';

export function Header() {
  const { cart } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, toggleCart, toggleSearch } = useUIStore();
  const { user, isAuthenticated } = useAuthStore();
  const { wishlistIds } = useWishlistStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      {/* Top Banner */}
      <div className="gradient-primary text-white py-2 text-center text-sm font-medium">
        <div className="container-custom flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>¡Envío gratis en compras mayores a S/500!</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
      
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <span className="gradient-text text-3xl font-extrabold tracking-tight">
                AKEMY
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-0.5 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { href: '/productos', label: 'Productos' },
              { href: '/categorias', label: 'Categorías' },
              { href: '/ofertas', label: 'Ofertas' },
              { href: '/nosotros', label: 'Nosotros' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="¿Qué estás buscando?"
                className="w-full pl-11 pr-4 h-11 rounded-full border-2 border-muted bg-muted/50 focus:bg-white focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary/10 hover:text-primary rounded-full"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* User */}
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link href="/cuenta/lista-deseos">
                  <Button variant="ghost" size="icon" className="relative hover:bg-red-500/10 hover:text-red-500 rounded-full">
                    <Heart className="h-5 w-5" />
                    {wishlistIds.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg animate-scale-in">
                        {wishlistIds.length}
                      </span>
                    )}
                    <span className="sr-only">Lista de deseos</span>
                  </Button>
                </Link>
                <Link href="/cuenta">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Mi cuenta</span>
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  Iniciar sesión
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-primary/10 hover:text-primary rounded-full"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart && (cart.totalItems || cart.itemCount || 0) > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white shadow-lg animate-scale-in">
                  {cart.totalItems || cart.itemCount}
                </span>
              )}
              <span className="sr-only">Carrito</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10 hover:text-primary rounded-full"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menú</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 animate-slide-up">
            <nav className="flex flex-col space-y-1">
              {[
                { href: '/productos', label: 'Productos' },
                { href: '/categorias', label: 'Categorías' },
                { href: '/ofertas', label: 'Ofertas' },
                { href: '/nosotros', label: 'Nosotros' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
