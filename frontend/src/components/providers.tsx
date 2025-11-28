'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store';
import { cartApi, wishlistApi } from '@/lib/api';

// Componente para inicializar datos del usuario
function DataInitializer() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCart = useCartStore((state) => state.setCart);
  const getOrCreateSessionId = useCartStore((state) => state.getOrCreateSessionId);
  const setWishlistIds = useWishlistStore((state) => state.setWishlistIds);
  const initialized = useRef(false);

  useEffect(() => {
    // Solo ejecutar una vez después del mount
    if (initialized.current) return;
    initialized.current = true;

    const loadData = async () => {
      // Cargar carrito
      try {
        const sessionId = isAuthenticated ? undefined : getOrCreateSessionId();
        const response = await cartApi.get(sessionId);
        if (response.data) {
          setCart(response.data);
        }
      } catch (error) {
        // Silenciar error
      }

      // Cargar wishlist IDs solo si está autenticado (solo los IDs, no los productos completos)
      if (isAuthenticated) {
        try {
          const response = await wishlistApi.getWishlistIds();
          if (response.data) {
            setWishlistIds(response.data);
          }
        } catch (error) {
          // Silenciar error
        }
      }
    };

    // Pequeño delay para asegurar que el store esté hidratado
    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DataInitializer />
      {children}
    </QueryClientProvider>
  );
}
