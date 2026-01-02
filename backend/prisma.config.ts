import { defineConfig } from 'prisma';

// Prisma 7+ requires datasource URLs outside of schema.prisma
export default defineConfig({
  schemas: ['./prisma/schema.prisma'],
  datasource: {
    url: { fromEnvVar: 'DATABASE_URL' },
  },
});
