import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
  phone?: string;
  avatar?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: Array<{ url: string }>;
    stock: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  subtotal?: number;
  itemCount: number;
  totalItems?: number;
}

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setIsLoading: (value) => set({ isLoading: value }),
      login: (user, accessToken, refreshToken) => {
        // Guardar tokens en sessionStorage (se borran al cerrar pestaña)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('refreshToken', refreshToken);
        }
        set({ user, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
        }
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'auth-session',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(name);
          }
        },
      },
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }) as AuthState,
    }
  )
);

// Cart Store
interface LocalCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  cart: Cart | null;
  localCart: LocalCartItem[];
  sessionId: string | null;
  isLoading: boolean;
  setCart: (cart: Cart | null) => void;
  setSessionId: (sessionId: string | null) => void;
  getOrCreateSessionId: () => string;
  setIsLoading: (value: boolean) => void;
  addItem: (item: LocalCartItem) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      localCart: [],
      sessionId: null,
      isLoading: false,
      setCart: (cart) => set({ cart }),
      setSessionId: (sessionId) => set({ sessionId }),
      getOrCreateSessionId: () => {
        let sessionId = get().sessionId;
        if (!sessionId) {
          sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
          set({ sessionId });
        }
        return sessionId;
      },
      setIsLoading: (value) => set({ isLoading: value }),
      addItem: (item) => {
        const localCart = get().localCart;
        const existingIndex = localCart.findIndex(i => i.productId === item.productId);
        if (existingIndex >= 0) {
          const updated = [...localCart];
          updated[existingIndex].quantity += item.quantity;
          set({ localCart: updated });
        } else {
          set({ localCart: [...localCart, item] });
        }
      },
      updateItemQuantity: (itemId, quantity) => {
        const cart = get().cart;
        if (cart) {
          const items = cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          const total = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
          set({ cart: { ...cart, items, total, itemCount } });
        }
      },
      removeItem: (itemId) => {
        const cart = get().cart;
        if (cart) {
          const items = cart.items.filter((item) => item.id !== itemId);
          const total = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
          set({ cart: { ...cart, items, total, itemCount } });
        }
      },
      clearCart: () => set({ cart: null }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ sessionId: state.sessionId }) as CartState,
    }
  )
);

// UI Store
interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleCart: () => void;
  toggleSearch: () => void;
  setCartOpen: (value: boolean) => void;
  setSearchOpen: (value: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setCartOpen: (value) => set({ isCartOpen: value }),
  setSearchOpen: (value) => set({ isSearchOpen: value }),
}));

// Wishlist Store
interface WishlistState {
  wishlistIds: string[];
  isLoading: boolean;
  setWishlistIds: (ids: string[]) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setIsLoading: (value: boolean) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      isLoading: false,
      setWishlistIds: (ids) => set({ wishlistIds: ids }),
      addToWishlist: (productId) => {
        const wishlistIds = get().wishlistIds;
        if (!wishlistIds.includes(productId)) {
          set({ wishlistIds: [...wishlistIds, productId] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlistIds: get().wishlistIds.filter(id => id !== productId) });
      },
      isInWishlist: (productId) => get().wishlistIds.includes(productId),
      setIsLoading: (value) => set({ isLoading: value }),
      clearWishlist: () => set({ wishlistIds: [] }),
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ wishlistIds: state.wishlistIds }) as WishlistState,
    }
  )
);
