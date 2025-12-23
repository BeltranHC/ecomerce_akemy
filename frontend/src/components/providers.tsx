'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store';
import { cartApi, wishlistApi } from '@/lib/api';
import { SocketProvider } from '@/lib/socket';

// Componente para inicializar datos del usuario
function DataInitializer() {
  const { isAuthenticated, setIsLoading } = useAuthStore();
  const setCart = useCartStore((state) => state.setCart);
  const getOrCreateSessionId = useCartStore((state) => state.getOrCreateSessionId);
  const setWishlistIds = useWishlistStore((state) => state.setWishlistIds);
  const initialized = useRef(false);
  const lastAuthState = useRef(isAuthenticated);

  // Inicializar el estado de autenticación al montar
  useEffect(() => {
    const initAuth = () => {
      if (typeof window === 'undefined') return;
      
      // Verificar si hay token en sessionStorage o cookies (igual que en el interceptor de API)
      let token = null;
      token = sessionStorage.getItem('accessToken');
      if (!token) {
        token = Cookies.get('accessToken') || null;
      }
      
      // Establecer isLoading en false después de un breve delay
      // Esto permite que la app continúe incluso si hay problemas con la verificación del token
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // 500ms es suficiente para verificar el token
      
      return () => clearTimeout(timer);
    };
    
    initAuth();
  }, [setIsLoading]);

  useEffect(() => {
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
      } else {
        // Limpiar wishlist cuando el usuario cierra sesión
        setWishlistIds([]);
      }
    };

    // Ejecutar al montar o cuando cambia el estado de autenticación
    if (!initialized.current || lastAuthState.current !== isAuthenticated) {
      initialized.current = true;
      lastAuthState.current = isAuthenticated;
      
      // Pequeño delay para asegurar que el store esté hidratado
      const timer = setTimeout(loadData, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, setCart, getOrCreateSessionId, setWishlistIds]);

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
      <SocketProvider>
        <DataInitializer />
        {children}
      </SocketProvider>
    </QueryClientProvider>
  );
}
