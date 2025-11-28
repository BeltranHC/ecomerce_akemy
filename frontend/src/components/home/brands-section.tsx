'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

// Componente para manejar errores de imagen
function BrandLogo({ brand }: { brand: any }) {
  const [imageError, setImageError] = useState(false);
  
  if (brand.logo && !imageError) {
    return (
      <Image
        src={brand.logo}
        alt={brand.name}
        fill
        className="object-contain"
        onError={() => setImageError(true)}
      />
    );
  }
  
  return (
    <div className="flex items-center justify-center h-full">
      <span className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors">
        {brand.name}
      </span>
    </div>
  );
}

export function BrandsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['brands-public'],
    queryFn: () => brandsApi.getPublic().then((res) => res.data),
  });

  // Asegurar que brands sea un array
  const brands = Array.isArray(data) ? data : [];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Nuestras marcas</h2>
          <p className="mt-2 text-muted-foreground">
            Trabajamos con las mejores marcas del mercado
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {brands?.map((brand: any) => (
              <Link
                key={brand.id}
                href={`/productos?brandId=${brand.id}`}
                className="group"
              >
                <div className="relative h-16 w-32 grayscale opacity-60 transition-all group-hover:grayscale-0 group-hover:opacity-100">
                  <BrandLogo brand={brand} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
