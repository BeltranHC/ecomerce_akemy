import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'AKEMY - Tu papelería favorita',
    template: '%s | AKEMY',
  },
  description: 'Encuentra los mejores artículos de papelería, útiles escolares, libros y más en AKEMY. Envíos a todo el Perú.',
  keywords: ['papelería', 'útiles escolares', 'libros', 'oficina', 'arte', 'AKEMY'],
  authors: [{ name: 'AKEMY' }],
  icons: {
    icon: '/logoakemy.jpg',
    apple: '/logoakemy.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: 'AKEMY',
    images: ['/logoakemy.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 1500,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
