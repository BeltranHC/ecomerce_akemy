import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = `${baseUrl}/api`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    // Primero intentar sessionStorage, luego cookies como fallback
    let token = null;
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('accessToken');
    }
    if (!token) {
      token = Cookies.get('accessToken');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar obtener refresh token de sessionStorage primero
        let refreshToken = null;
        if (typeof window !== 'undefined') {
          refreshToken = sessionStorage.getItem('refreshToken');
        }
        if (!refreshToken) {
          refreshToken = Cookies.get('refreshToken');
        }

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Guardar en sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('refreshToken', newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar storage y redirigir a login
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
        }
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  adminLogin: (data: { email: string; password: string }) =>
    api.post('/auth/admin/login', data),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/auth/register', data),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify/${token}`),

  resendVerificationEmail: (email: string) =>
    api.post('/auth/resend-verification', { email }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),

  getProfile: () => api.get('/auth/profile'),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: () => api.post('/auth/logout'),
};

// Products API
export const productsApi = {
  // Público - para el storefront (no requiere auth)
  getPublic: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/products/public', { params }),

  // Admin - requiere autenticación
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => api.get('/products', { params }),

  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),

  getById: (id: string) => api.get(`/products/${id}`),

  getFeatured: () => api.get('/products/featured'),

  create: (data: any) => api.post('/products', data),

  update: (id: string, data: any) => api.patch(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),

  updateStock: (id: string, data: { quantity: number; type: 'IN' | 'OUT'; reason?: string }) =>
    api.patch(`/products/${id}/stock`, data),

  addImage: (productId: string, data: { url: string; alt?: string; isPrimary?: boolean }) =>
    api.post(`/products/${productId}/images`, data),

  removeImage: (imageId: string) => api.delete(`/products/images/${imageId}`),
};

// Reviews API
export const reviewsApi = {
  getByProduct: (productId?: string) => api.get(`/reviews/product/${productId}`),
  create: (data: { productId: string; rating: number; comment?: string; orderId?: string }) =>
    api.post('/reviews', data),
  // Admin methods
  getAll: (params?: { page?: number; limit?: number; status?: 'PENDING' | 'APPROVED' | 'REJECTED' }) =>
    api.get('/reviews', { params }),
  updateStatus: (id: string, data: { status: 'APPROVED' | 'REJECTED' }) =>
    api.post(`/reviews/${id}/status`, data),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),

  getPublic: () => api.get('/categories/public'),

  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),

  getById: (id: string) => api.get(`/categories/${id}`),

  create: (data: { name: string; description?: string; imageUrl?: string; parentId?: string }) =>
    api.post('/categories', data),

  update: (id: string, data: { name?: string; description?: string; imageUrl?: string; parentId?: string }) =>
    api.patch(`/categories/${id}`, data),

  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Brands API
export const brandsApi = {
  getAll: () => api.get('/brands'),

  getPublic: () => api.get('/brands/public'),

  getById: (id: string) => api.get(`/brands/${id}`),

  create: (data: { name: string; description?: string; logoUrl?: string }) =>
    api.post('/brands', data),

  update: (id: string, data: { name?: string; description?: string; logoUrl?: string }) =>
    api.patch(`/brands/${id}`, data),

  delete: (id: string) => api.delete(`/brands/${id}`),
};

// Cart API
export const cartApi = {
  get: (sessionId?: string) =>
    api.get('/cart', {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    }),

  addItem: (data: { productId: string; quantity: number }, sessionId?: string) =>
    api.post('/cart/items', { productId: data.productId, quantity: data.quantity }, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    }),

  updateItem: (itemId: string, data: { quantity: number }, sessionId?: string) =>
    api.patch(`/cart/items/${itemId}`, data, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    }),

  removeItem: (itemId: string, sessionId?: string) =>
    api.delete(`/cart/items/${itemId}`, {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    }),

  clear: (sessionId?: string) =>
    api.delete('/cart', {
      headers: sessionId ? { 'x-session-id': sessionId } : {}
    }),

  transfer: (sessionId: string) =>
    api.post('/cart/transfer', {}, {
      headers: { 'x-session-id': sessionId }
    }),
};

// Orders API
export const ordersApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/orders', { params }),

  getMyOrders: (params?: { page?: number; limit?: number }) =>
    api.get('/orders/my-orders', { params }),

  getById: (id: string) => api.get(`/orders/${id}`),

  getByOrderNumber: (orderNumber: string) => api.get(`/orders/number/${orderNumber}`),

  create: (data: {
    shippingAddress?: {
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      city: string;
      district: string;
      postalCode?: string;
    };
    addressId?: string;
    items?: Array<{ productId: string; quantity: number; variantId?: string }>;
    useCart?: boolean;
    notes?: string;
    paymentMethod?: string;
    shippingCost?: number;
    discount?: number;
  }) => api.post('/orders', data),

  updateStatus: (id: string, data: { status: string }) =>
    api.patch(`/orders/${id}/status`, data),

  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),

  markAsPaid: (id: string) => api.patch(`/orders/${id}/pay`),
};

// Users API (Admin)
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; role?: string }) =>
    api.get('/users', { params }),

  getCustomers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/users/customers', { params }),

  getById: (id: string) => api.get(`/users/${id}`),

  create: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => api.post('/users', data),

  update: (id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
  }) => api.patch(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),

  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => api.patch('/users/profile', data),
};

// Banners API
export const bannersApi = {
  getAll: () => api.get('/banners'),

  getActive: () => api.get('/banners/active'),

  getById: (id: string) => api.get(`/banners/${id}`),

  create: (data: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    link?: string;
    sortOrder?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  }) => api.post('/banners', data),

  update: (id: string, data: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    link?: string;
    sortOrder?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  }) => api.patch(`/banners/${id}`, data),

  delete: (id: string) => api.delete(`/banners/${id}`),

  toggleActive: (id: string) => api.patch(`/banners/${id}/toggle-active`),
};

// Settings API
export const settingsApi = {
  get: () => api.get('/settings'),

  getPublic: () => api.get('/settings/public'),

  update: (data: { key: string; value: string }) =>
    api.patch(`/settings/${data.key}`, { value: data.value }),

  updateMany: (settings: Array<{ key: string; value: string }>) =>
    api.patch('/settings', settings),
};

// Dashboard API (Admin)
export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard/stats'),

  getSalesChart: (period: 'week' | 'month' | 'year') =>
    api.get('/admin/dashboard/sales-chart', { params: { period } }),

  getOrdersByStatus: () => api.get('/admin/dashboard/orders-by-status'),
};

// Upload API
export const uploadApi = {
  uploadFile: (formData: FormData) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  uploadProductImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadProductImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post('/upload/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadBannerImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadCategoryImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadBrandImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/brand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteImage: (folder: string, filename: string) =>
    api.delete(`/upload/${folder}/${filename}`),
};

// Wishlist API
export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),

  getWishlistIds: () => api.get('/wishlist/ids'),

  getWishlistCount: () => api.get('/wishlist/count'),

  isInWishlist: (productId: string) => api.get(`/wishlist/check/${productId}`),

  addToWishlist: (productId: string) => api.post(`/wishlist/${productId}`),

  removeFromWishlist: (productId: string) => api.delete(`/wishlist/${productId}`),

  toggleWishlist: (productId: string) => api.post(`/wishlist/toggle/${productId}`),

  clearWishlist: () => api.delete('/wishlist'),
};

// Offers API
export const offersApi = {
  getAll: (params?: { page?: number; limit?: number; isActive?: boolean }) =>
    api.get('/offers', { params }),

  getActive: () => api.get('/offers/active'),

  getById: (id: string) => api.get(`/offers/${id}`),

  getBySlug: (slug: string) => api.get(`/offers/slug/${slug}`),

  getProductOfferPrice: (productId: string) =>
    api.get(`/offers/product/${productId}/price`),

  create: (data: {
    name: string;
    slug?: string;
    description?: string;
    type: string;
    value: number;
    isActive?: boolean;
    startDate: string;
    endDate: string;
    products?: Array<{ productId: string; specialPrice?: number }>;
  }) => api.post('/offers', data),

  update: (id: string, data: any) => api.patch(`/offers/${id}`, data),

  delete: (id: string) => api.delete(`/offers/${id}`),

  addProduct: (offerId: string, productId: string, specialPrice?: number) =>
    api.post(`/offers/${offerId}/products/${productId}`, { specialPrice }),

  removeProduct: (offerId: string, productId: string) =>
    api.delete(`/offers/${offerId}/products/${productId}`),

  updateProductPrice: (offerId: string, productId: string, specialPrice: number) =>
    api.patch(`/offers/${offerId}/products/${productId}/price`, { specialPrice }),
};
