import { PrismaClient, UserRole, ProductStatus, MovementType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos AKEMY...');

  // Limpiar tablas existentes
  await prisma.auditLog.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSetting.deleteMany();
  await prisma.banner.deleteMany();

  // Crear Super Admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@akemy.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPERADMIN,
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Super Admin creado:', superAdmin.email);

  // Crear usuario de prueba (cliente)
  const customerPassword = await bcrypt.hash('Cliente123!', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'cliente@test.com',
      password: customerPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '987654321',
      role: UserRole.CUSTOMER,
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Cliente de prueba creado:', customer.email);

  // Crear dirección para el cliente
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Casa',
      recipientName: 'Juan Pérez',
      phone: '987654321',
      street: 'Av. Los Olivos',
      number: '123',
      district: 'Los Olivos',
      city: 'Lima',
      province: 'Lima',
      department: 'Lima',
      postalCode: '15301',
      reference: 'Frente al parque',
      isDefault: true,
    },
  });

  // Crear marcas populares en Perú (sin logos - se suben desde el admin)
  const brands = await Promise.all([
    prisma.brand.create({
      data: { 
        name: 'Faber-Castell', 
        slug: 'faber-castell', 
        description: 'Marca alemana líder mundial en artículos de escritura y dibujo',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Artesco', 
        slug: 'artesco', 
        description: 'Marca peruana líder en útiles escolares y de oficina',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Pilot', 
        slug: 'pilot', 
        description: 'Marca japonesa premium de bolígrafos y lapiceros',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Stabilo', 
        slug: 'stabilo', 
        description: 'Marca alemana especializada en resaltadores y plumones',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Stanford', 
        slug: 'stanford', 
        description: 'Marca peruana de cuadernos y artículos de papelería',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Vinifan', 
        slug: 'vinifan', 
        description: 'Marca peruana especializada en forros y cuadernos escolares',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Layconsa', 
        slug: 'layconsa', 
        description: 'Marca peruana de cuadernos y papelería escolar',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'David', 
        slug: 'david', 
        description: 'Marca peruana de útiles escolares de calidad',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Pelikan', 
        slug: 'pelikan', 
        description: 'Marca alemana premium de instrumentos de escritura',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'BIC', 
        slug: 'bic', 
        description: 'Marca francesa de bolígrafos, encendedores y artículos de papelería',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Pentel', 
        slug: 'pentel', 
        description: 'Marca japonesa de instrumentos de escritura y arte',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'Norma', 
        slug: 'norma', 
        description: 'Marca colombiana líder en cuadernos y papelería',
      },
    }),
    prisma.brand.create({
      data: { 
        name: '3M', 
        slug: '3m', 
        description: 'Multinacional conocida por Post-it y productos de oficina',
      },
    }),
    prisma.brand.create({
      data: { 
        name: 'UHU', 
        slug: 'uhu', 
        description: 'Marca alemana líder en pegamentos y adhesivos',
      },
    }),
  ]);
  console.log('✅ Marcas creadas:', brands.length);

  // Crear categorías principales
  const categoriaUtiles = await prisma.category.create({
    data: {
      name: 'Útiles Escolares',
      slug: 'utiles-escolares',
      description: 'Todo lo necesario para el colegio',
      sortOrder: 1,
    },
  });

  const categoriaCuadernos = await prisma.category.create({
    data: {
      name: 'Cuadernos',
      slug: 'cuadernos',
      description: 'Cuadernos de todo tipo y tamaño',
      sortOrder: 2,
    },
  });

  const categoriaEscritura = await prisma.category.create({
    data: {
      name: 'Escritura',
      slug: 'escritura',
      description: 'Lapiceros, lápices y plumones',
      sortOrder: 3,
    },
  });

  const categoriaArchivadores = await prisma.category.create({
    data: {
      name: 'Archivadores',
      slug: 'archivadores',
      description: 'Organiza tus documentos',
      sortOrder: 4,
    },
  });

  const categoriaPapeleria = await prisma.category.create({
    data: {
      name: 'Papelería',
      slug: 'papeleria',
      description: 'Hojas, cartulinas y más',
      sortOrder: 5,
    },
  });

  const categoriaArte = await prisma.category.create({
    data: {
      name: 'Arte y Manualidades',
      slug: 'arte-manualidades',
      description: 'Materiales para creativos',
      sortOrder: 6,
    },
  });

  // Crear subcategorías
  await prisma.category.createMany({
    data: [
      { name: 'Lápices', slug: 'lapices', parentId: categoriaEscritura.id, sortOrder: 1 },
      { name: 'Lapiceros', slug: 'lapiceros', parentId: categoriaEscritura.id, sortOrder: 2 },
      { name: 'Plumones', slug: 'plumones', parentId: categoriaEscritura.id, sortOrder: 3 },
      { name: 'Resaltadores', slug: 'resaltadores', parentId: categoriaEscritura.id, sortOrder: 4 },
      { name: 'Cuadernos Rayados', slug: 'cuadernos-rayados', parentId: categoriaCuadernos.id, sortOrder: 1 },
      { name: 'Cuadernos Cuadriculados', slug: 'cuadernos-cuadriculados', parentId: categoriaCuadernos.id, sortOrder: 2 },
      { name: 'Blocks', slug: 'blocks', parentId: categoriaCuadernos.id, sortOrder: 3 },
    ],
  });

  console.log('✅ Categorías creadas');

  // Crear productos
  const productos = [
    {
      sku: 'LAP-001',
      barcode: '7501234567890',
      name: 'Lápiz Faber-Castell 2B',
      slug: 'lapiz-faber-castell-2b',
      description: 'Lápiz de grafito profesional 2B, ideal para dibujo y escritura. Mina resistente y fácil de borrar.',
      shortDescription: 'Lápiz profesional 2B para dibujo',
      price: 2.50,
      comparePrice: 3.00,
      stock: 150,
      categoryId: categoriaEscritura.id,
      brandId: brands[0].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'BOL-001',
      barcode: '7501234567891',
      name: 'Lapicero Pilot G-2 Azul',
      slug: 'lapicero-pilot-g2-azul',
      description: 'Bolígrafo de gel con tinta de secado rápido. Grip ergonómico para mayor comodidad.',
      shortDescription: 'Bolígrafo de gel azul',
      price: 8.90,
      comparePrice: 10.00,
      stock: 80,
      categoryId: categoriaEscritura.id,
      brandId: brands[2].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'CUA-001',
      barcode: '7501234567892',
      name: 'Cuaderno Stanford A4 200 hojas Rayado',
      slug: 'cuaderno-stanford-a4-200-hojas-rayado',
      description: 'Cuaderno de alta calidad con 200 hojas rayadas. Tapa dura con diseño moderno.',
      shortDescription: 'Cuaderno A4 200 hojas',
      price: 18.90,
      comparePrice: 22.00,
      stock: 45,
      categoryId: categoriaCuadernos.id,
      brandId: brands[4].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'RES-001',
      barcode: '7501234567893',
      name: 'Resaltadores Stabilo Boss x6 colores',
      slug: 'resaltadores-stabilo-boss-x6',
      description: 'Set de 6 resaltadores Stabilo Boss en colores pastel. Tinta con base de agua.',
      shortDescription: 'Pack 6 resaltadores pastel',
      price: 35.00,
      comparePrice: 42.00,
      stock: 30,
      categoryId: categoriaEscritura.id,
      brandId: brands[3].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'ARC-001',
      barcode: '7501234567894',
      name: 'Archivador Artesco A4 Lomo Ancho',
      slug: 'archivador-artesco-a4-lomo-ancho',
      description: 'Archivador de palanca tamaño A4 con lomo ancho de 8cm. Incluye etiqueta identificadora.',
      shortDescription: 'Archivador A4 lomo ancho',
      price: 12.50,
      comparePrice: 15.00,
      stock: 60,
      categoryId: categoriaArchivadores.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'PAP-001',
      barcode: '7501234567895',
      name: 'Papel Bond A4 75gr x500 hojas',
      slug: 'papel-bond-a4-75gr-x500',
      description: 'Resma de papel bond A4 de 75 gramos. Ideal para impresión y copias.',
      shortDescription: 'Resma papel A4 500 hojas',
      price: 28.00,
      comparePrice: 32.00,
      stock: 100,
      categoryId: categoriaPapeleria.id,
      brandId: null,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'COL-001',
      barcode: '7501234567896',
      name: 'Colores Faber-Castell x24',
      slug: 'colores-faber-castell-x24',
      description: 'Set de 24 lápices de colores. Mina resistente y colores vibrantes.',
      shortDescription: 'Set 24 colores',
      price: 45.00,
      comparePrice: 55.00,
      stock: 40,
      categoryId: categoriaArte.id,
      brandId: brands[0].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'PLU-001',
      barcode: '7501234567897',
      name: 'Plumones Artesco x12 colores',
      slug: 'plumones-artesco-x12',
      description: 'Set de 12 plumones escolares con punta cónica. Colores brillantes y lavables.',
      shortDescription: 'Set 12 plumones escolares',
      price: 15.00,
      comparePrice: 18.00,
      stock: 55,
      categoryId: categoriaArte.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'FOR-001',
      barcode: '7501234567898',
      name: 'Forro Vinifan Transparente x3',
      slug: 'forro-vinifan-transparente-x3',
      description: 'Pack de 3 forros transparentes autoadhesivos. Protege tus libros y cuadernos.',
      shortDescription: 'Pack 3 forros transparentes',
      price: 8.00,
      comparePrice: 10.00,
      stock: 70,
      categoryId: categoriaUtiles.id,
      brandId: brands[5].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'TIJ-001',
      barcode: '7501234567899',
      name: 'Tijera Artesco Escolar',
      slug: 'tijera-artesco-escolar',
      description: 'Tijera escolar con punta roma y mango ergonómico. Segura para niños.',
      shortDescription: 'Tijera escolar punta roma',
      price: 5.50,
      comparePrice: 7.00,
      stock: 90,
      categoryId: categoriaUtiles.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    // Nuevos productos adicionales
    {
      sku: 'LAP-002',
      barcode: '7501234567900',
      name: 'Lápiz Mongol HB x12',
      slug: 'lapiz-mongol-hb-x12',
      description: 'Caja de 12 lápices Mongol HB de alta calidad para escritura diaria.',
      shortDescription: 'Caja 12 lápices HB',
      price: 12.00,
      comparePrice: 15.00,
      stock: 120,
      categoryId: categoriaEscritura.id,
      brandId: brands[0].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'BOL-002',
      barcode: '7501234567901',
      name: 'Lapicero Faber-Castell Trilux Negro',
      slug: 'lapicero-faber-castell-trilux-negro',
      description: 'Bolígrafo con grip triangular para mayor comodidad. Tinta negra de secado rápido.',
      shortDescription: 'Bolígrafo trilux negro',
      price: 3.50,
      comparePrice: 4.50,
      stock: 200,
      categoryId: categoriaEscritura.id,
      brandId: brands[0].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'CUA-002',
      barcode: '7501234567902',
      name: 'Cuaderno Justus A5 100 hojas Cuadriculado',
      slug: 'cuaderno-justus-a5-100-hojas-cuadriculado',
      description: 'Cuaderno tamaño A5 con 100 hojas cuadriculadas. Ideal para matemáticas.',
      shortDescription: 'Cuaderno A5 cuadriculado',
      price: 9.90,
      comparePrice: 12.00,
      stock: 80,
      categoryId: categoriaCuadernos.id,
      brandId: brands[4].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'BOR-001',
      barcode: '7501234567903',
      name: 'Borrador Pelikan WS-30',
      slug: 'borrador-pelikan-ws30',
      description: 'Borrador blanco de alta calidad que no mancha el papel.',
      shortDescription: 'Borrador blanco premium',
      price: 1.50,
      comparePrice: 2.00,
      stock: 300,
      categoryId: categoriaUtiles.id,
      brandId: brands[8].id, // Pelikan
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'TAJ-001',
      barcode: '7501234567904',
      name: 'Tajador Faber-Castell Doble',
      slug: 'tajador-faber-castell-doble',
      description: 'Tajador con dos orificios para lápices estándar y gruesos. Con depósito.',
      shortDescription: 'Tajador doble con depósito',
      price: 4.00,
      comparePrice: 5.00,
      stock: 150,
      categoryId: categoriaUtiles.id,
      brandId: brands[0].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'REG-001',
      barcode: '7501234567905',
      name: 'Regla Artesco 30cm Transparente',
      slug: 'regla-artesco-30cm-transparente',
      description: 'Regla de plástico transparente de 30cm con marcas claras y precisas.',
      shortDescription: 'Regla 30cm transparente',
      price: 2.00,
      comparePrice: 2.50,
      stock: 180,
      categoryId: categoriaUtiles.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'PEG-001',
      barcode: '7501234567906',
      name: 'Pegamento UHU Barra 40g',
      slug: 'pegamento-uhu-barra-40g',
      description: 'Pegamento en barra de 40 gramos. No tóxico y fácil de usar.',
      shortDescription: 'Pegamento barra 40g',
      price: 6.50,
      comparePrice: 8.00,
      stock: 100,
      categoryId: categoriaUtiles.id,
      brandId: brands[13].id, // UHU
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'CIN-001',
      barcode: '7501234567907',
      name: 'Cinta Masking Tape 24mm',
      slug: 'cinta-masking-tape-24mm',
      description: 'Cinta adhesiva de papel de 24mm ideal para manualidades y oficina.',
      shortDescription: 'Masking tape 24mm',
      price: 4.50,
      comparePrice: 5.50,
      stock: 120,
      categoryId: categoriaPapeleria.id,
      brandId: null,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'POS-001',
      barcode: '7501234567908',
      name: 'Post-it 3M x100 hojas Amarillo',
      slug: 'post-it-3m-x100-amarillo',
      description: 'Block de 100 notas adhesivas amarillas. Tamaño 3x3 pulgadas.',
      shortDescription: 'Post-it amarillo x100',
      price: 8.00,
      comparePrice: 10.00,
      stock: 90,
      categoryId: categoriaPapeleria.id,
      brandId: brands[12].id, // 3M
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'CAR-001',
      barcode: '7501234567909',
      name: 'Cartulina Canson A4 Colores x10',
      slug: 'cartulina-canson-a4-colores-x10',
      description: 'Pack de 10 cartulinas tamaño A4 en colores variados. 180g/m2.',
      shortDescription: 'Cartulinas A4 colores x10',
      price: 12.00,
      comparePrice: 15.00,
      stock: 60,
      categoryId: categoriaArte.id,
      brandId: null,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'TEM-001',
      barcode: '7501234567910',
      name: 'Témperas Artesco x6 colores',
      slug: 'temperas-artesco-x6-colores',
      description: 'Set de 6 témperas de colores básicos. No tóxicas y lavables.',
      shortDescription: 'Témperas x6 colores',
      price: 15.00,
      comparePrice: 18.00,
      stock: 45,
      categoryId: categoriaArte.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'PIN-001',
      barcode: '7501234567911',
      name: 'Pinceles Artesco Set x6',
      slug: 'pinceles-artesco-set-x6',
      description: 'Set de 6 pinceles de diferentes tamaños para pintura escolar.',
      shortDescription: 'Set 6 pinceles',
      price: 10.00,
      comparePrice: 12.00,
      stock: 55,
      categoryId: categoriaArte.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'CRA-001',
      barcode: '7501234567912',
      name: 'Crayones Faber-Castell x24',
      slug: 'crayones-faber-castell-x24',
      description: 'Set de 24 crayones de cera de colores vibrantes. No tóxicos.',
      shortDescription: 'Crayones x24',
      price: 18.00,
      comparePrice: 22.00,
      stock: 70,
      categoryId: categoriaArte.id,
      brandId: brands[0].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'MOC-001',
      barcode: '7501234567913',
      name: 'Mochila Escolar Azul',
      slug: 'mochila-escolar-azul',
      description: 'Mochila escolar resistente con múltiples compartimentos. Color azul.',
      shortDescription: 'Mochila escolar azul',
      price: 89.90,
      comparePrice: 110.00,
      stock: 25,
      categoryId: categoriaUtiles.id,
      brandId: null,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
    {
      sku: 'CAR-002',
      barcode: '7501234567914',
      name: 'Cartuchera Doble Cierre',
      slug: 'cartuchera-doble-cierre',
      description: 'Cartuchera con doble compartimento y cierre. Diseño moderno.',
      shortDescription: 'Cartuchera doble',
      price: 25.00,
      comparePrice: 30.00,
      stock: 50,
      categoryId: categoriaUtiles.id,
      brandId: null,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'COM-001',
      barcode: '7501234567915',
      name: 'Compás Escolar Metálico',
      slug: 'compas-escolar-metalico',
      description: 'Compás metálico de precisión con lápiz incluido.',
      shortDescription: 'Compás metálico',
      price: 8.00,
      comparePrice: 10.00,
      stock: 80,
      categoryId: categoriaUtiles.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'ESC-001',
      barcode: '7501234567916',
      name: 'Escuadras Artesco Set x2',
      slug: 'escuadras-artesco-set-x2',
      description: 'Set de 2 escuadras de 45° y 60° en plástico transparente.',
      shortDescription: 'Set escuadras x2',
      price: 6.00,
      comparePrice: 8.00,
      stock: 100,
      categoryId: categoriaUtiles.id,
      brandId: brands[1].id,
      status: ProductStatus.PUBLISHED,
      isFeatured: false,
    },
    {
      sku: 'CAL-001',
      barcode: '7501234567917',
      name: 'Calculadora Casio FX-82LA',
      slug: 'calculadora-casio-fx82la',
      description: 'Calculadora científica con 252 funciones. Ideal para estudiantes.',
      shortDescription: 'Calculadora científica',
      price: 65.00,
      comparePrice: 75.00,
      stock: 30,
      categoryId: categoriaUtiles.id,
      brandId: null,
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
    },
  ];

  for (const producto of productos) {
    const createdProduct = await prisma.product.create({
      data: producto,
    });

    // Crear imagen para el producto
    await prisma.productImage.create({
      data: {
        productId: createdProduct.id,
        url: `/images/products/${producto.slug}.jpg`,
        alt: producto.name,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    // Crear movimiento de inventario inicial
    await prisma.inventoryMovement.create({
      data: {
        productId: createdProduct.id,
        type: MovementType.INITIAL,
        quantity: producto.stock,
        stockBefore: 0,
        stockAfter: producto.stock,
        notes: 'Stock inicial',
        createdBy: superAdmin.id,
      },
    });
  }

  console.log('✅ Productos creados:', productos.length);

  // Crear configuraciones de la tienda
  const settings = [
    { key: 'store_name', value: 'AKEMY', type: 'string', group: 'general' },
    { key: 'store_description', value: 'Tu papelería y librería de confianza', type: 'string', group: 'general' },
    { key: 'store_email', value: 'contacto@akemy.com', type: 'string', group: 'general' },
    { key: 'store_phone', value: '(01) 555-1234', type: 'string', group: 'general' },
    { key: 'store_address', value: 'Av. Principal 123, Lima, Perú', type: 'string', group: 'general' },
    { key: 'currency', value: 'PEN', type: 'string', group: 'general' },
    { key: 'currency_symbol', value: 'S/', type: 'string', group: 'general' },
    { key: 'logo_url', value: '/images/logo.png', type: 'string', group: 'general' },
    { key: 'favicon_url', value: '/images/favicon.ico', type: 'string', group: 'general' },
    { key: 'shipping_cost', value: '10.00', type: 'number', group: 'shipping' },
    { key: 'free_shipping_min', value: '100.00', type: 'number', group: 'shipping' },
    { key: 'low_stock_threshold', value: '10', type: 'number', group: 'inventory' },
  ];

  await prisma.storeSetting.createMany({ data: settings });
  console.log('✅ Configuraciones creadas');

  // Crear banners
  await prisma.banner.createMany({
    data: [
      {
        title: '¡Bienvenidos a AKEMY!',
        subtitle: 'Tu papelería y librería favorita',
        imageUrl: '/images/banners/banner-1.jpg',
        link: '/catalogo',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Regreso a Clases 2024',
        subtitle: 'Hasta 30% de descuento en útiles escolares',
        imageUrl: '/images/banners/banner-2.jpg',
        link: '/catalogo?categoria=utiles-escolares',
        sortOrder: 2,
        isActive: true,
      },
      {
        title: 'Nuevas Colecciones',
        subtitle: 'Descubre los mejores productos',
        imageUrl: '/images/banners/banner-3.jpg',
        link: '/catalogo?destacados=true',
        sortOrder: 3,
        isActive: true,
      },
    ],
  });
  console.log('✅ Banners creados');

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📧 Credenciales de acceso:');
  console.log('   Admin: admin@akemy.com / Admin123!');
  console.log('   Cliente: cliente@test.com / Cliente123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
