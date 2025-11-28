'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Esperar a que el store se hidrate desde localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    // Si es la página de login de admin, no redirigir
    if (pathname === '/admin/login') return;

    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (user?.role === 'CUSTOMER') {
      router.push('/');
    }
  }, [isAuthenticated, isHydrated, user, router, pathname]);

  // Mostrar loading mientras se hidrata
  if (!isHydrated) {
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
