import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AK-${timestamp}-${random}`;
}

// URL base del backend para imágenes
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Placeholder SVG como data URI
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Cpath d='M160 170h80v60h-80z' fill='%23d1d5db'/%3E%3Ccircle cx='180' cy='150' r='20' fill='%23d1d5db'/%3E%3Cpath d='M140 250l40-40 30 30 50-50 40 40v20H140z' fill='%23d1d5db'/%3E%3C/svg%3E";

export function getImageUrl(url: string | undefined | null): string {
  if (!url) {
    return PLACEHOLDER_IMAGE;
  }
  
  // Si ya es una URL completa (http/https), devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es una URL relativa que comienza con /images/, intentar servir desde el backend /uploads/
  if (url.startsWith('/images/')) {
    // Cambiar /images/ por /uploads/ y agregar URL del backend
    const backendPath = url.replace('/images/', '/uploads/');
    return `${API_URL}${backendPath}`;
  }
  
  // Si es una URL relativa que comienza con /uploads/, agregar URL del backend
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }
  
  // Si es data URI, devolverla tal cual
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Para cualquier otra URL relativa, intentar con el backend
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}
