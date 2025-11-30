'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';
import Cookies from 'js-cookie';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Validar token con el backend al cargar
  useEffect(() => {
    const validateSession = async () => {
      const token = Cookies.get('accessToken');
      
      // Si no hay token, la sesión no es válida
      if (!token) {
        logout();
        setIsValidating(false);
        setIsHydrated(true);
        return;
      }

      try {
        // Validar token llamando al endpoint de perfil
        await authApi.getProfile();
        setIsValidating(false);
        setIsHydrated(true);
      } catch (error) {
        // Token inválido o expirado, cerrar sesión
        console.log('Sesión inválida, cerrando sesión...');
        logout();
        setIsValidating(false);
        setIsHydrated(true);
      }
    };

    validateSession();
  }, [logout]);

  useEffect(() => {
    if (!isHydrated || isValidating) return;
    
    // Si es la página de login de admin, no redirigir
    if (pathname === '/admin/login') return;

    if (!isAuthenticated) {
      router.replace('/admin/login');
      return;
    }
    
    if (user?.role === 'CUSTOMER') {
      router.replace('/');
      return;
    }
  }, [isAuthenticated, isHydrated, isValidating, user, router, pathname]);

  // Mostrar loading mientras se hidrata o valida
  if (!isHydrated || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si es la página de login, renderizar sin el layout de admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated || user?.role === 'CUSTOMER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
