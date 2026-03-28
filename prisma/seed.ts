// prisma/seed.ts
// Run: npm run db:seed

import { PrismaClient, Role, SellerStatus, ProductStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding FindSolace database...')

  // Categories
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics', iconUrl: '📱', sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'fashion' }, update: {}, create: { name: 'Fashion', slug: 'fashion', iconUrl: '👗', sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'food' }, update: {}, create: { name: 'Food & Groceries', slug: 'food', iconUrl: '🍱', sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'beauty' }, update: {}, create: { name: 'Health & Beauty', slug: 'beauty', iconUrl: '💄', sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'home' }, update: {}, create: { name: 'Home & Garden', slug: 'home', iconUrl: '🏡', sortOrder: 5 } }),
  ])

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@findsolace.gh' },
    update: {},
    create: { fullName: 'Admin', email: 'admin@findsolace.gh', passwordHash: adminHash, role: Role.ADMIN, isVerified: true },
  })

  // Seller 1
  const s1Hash = await bcrypt.hash('seller123', 10)
  const seller1User = await prisma.user.upsert({
    where: { email: 'kofi@findsolace.gh' },
    update: {},
    create: { fullName: 'Kofi Mensah', email: 'kofi@findsolace.gh', passwordHash: s1Hash, role: Role.SELLER, phone: '+233244000001', location: 'Accra', isVerified: true },
  })
  const seller1 = await prisma.sellerProfile.upsert({
    where: { userId: seller1User.id },
    update: {},
    create: { userId: seller1User.id, shopName: "Kofi's TechStore", shopDescription: 'Quality electronics at the best prices in Accra. Find what you need, close to home.', commissionRate: 5, status: SellerStatus.ACTIVE, approvedAt: new Date(), momoNumber: '0244000001' },
  })

  // Seller 2
  const s2Hash = await bcrypt.hash('seller123', 10)
  const seller2User = await prisma.user.upsert({
    where: { email: 'abena@findsolace.gh' },
    update: {},
    create: { fullName: 'Abena Darko', email: 'abena@findsolace.gh', passwordHash: s2Hash, role: Role.SELLER, phone: '+233244000002', location: 'Kumasi', isVerified: true },
  })
  const seller2 = await prisma.sellerProfile.upsert({
    where: { userId: seller2User.id },
    update: {},
    create: { userId: seller2User.id, shopName: 'Abena Styles', shopDescription: 'Handcrafted Ghanaian fashion for every occasion.', commissionRate: 5, status: SellerStatus.ACTIVE, approvedAt: new Date(), momoNumber: '0244000002' },
  })

  // Buyer
  const buyerHash = await bcrypt.hash('buyer123', 10)
  await prisma.user.upsert({
    where: { email: 'buyer@findsolace.gh' },
    update: {},
    create: { fullName: 'Ama Mensah', email: 'buyer@findsolace.gh', passwordHash: buyerHash, role: Role.BUYER, isVerified: true },
  })

  // Products
  const products = [
    { sellerId: seller1.id, categoryId: cats[0].id, title: 'Tecno Spark 20 Pro', slug: 'tecno-spark-20-pro', description: 'Latest Tecno Spark with 6.78" display, 50MP camera, 5000mAh battery. Fast delivery across Ghana.', price: 1450, comparePrice: 1800, stockQty: 12, isSponsored: true, metaTags: ['tecno spark ghana', 'budget phone accra', 'android phone ghana'] },
    { sellerId: seller1.id, categoryId: cats[0].id, title: 'HP Laptop 256GB SSD', slug: 'hp-laptop-256gb-ssd', description: 'HP 15.6" laptop, Intel Core i5, 8GB RAM, 256GB SSD. Pre-installed with Windows 11 and Office.', price: 4200, comparePrice: 4800, stockQty: 5, isSponsored: true, metaTags: ['hp laptop ghana', 'laptop accra', 'student laptop ghana'] },
    { sellerId: seller1.id, categoryId: cats[0].id, title: 'Solar phone charger 15W', slug: 'solar-phone-charger-15w', description: '15W solar panel with dual USB output. Works outdoors and during power outages. Includes carry case.', price: 320, comparePrice: null, stockQty: 30, isSponsored: false, metaTags: ['solar charger ghana', 'power bank ghana', 'off-grid charging'] },
    { sellerId: seller2.id, categoryId: cats[1].id, title: 'Ankara maxi dress', slug: 'ankara-maxi-dress', description: 'Beautiful hand-crafted Ankara print maxi dress. Available in multiple sizes. Made by Ghanaian artisans.', price: 280, comparePrice: null, stockQty: 8, isSponsored: false, metaTags: ['ankara dress ghana', 'african fashion', 'kente dress kumasi'] },
    { sellerId: seller2.id, categoryId: cats[1].id, title: 'Kente shoulder bag', slug: 'kente-shoulder-bag', description: 'Handwoven kente fabric shoulder bag. Unique design, durable, and perfect as a gift.', price: 180, comparePrice: 220, stockQty: 15, isSponsored: false, metaTags: ['kente bag ghana', 'african bag', 'handmade bag kumasi'] },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, images: [{ url: '/images/placeholder.jpg', thumbnail: '/images/placeholder.jpg', publicId: 'placeholder' }], status: ProductStatus.ACTIVE, metaTitle: p.title + ' | FindSolace Ghana' },
    })
  }

  console.log('✅ Seed complete!')
  console.log('\n📧 Test accounts:')
  console.log('   Admin:  admin@findsolace.gh / admin123')
  console.log('   Seller: kofi@findsolace.gh  / seller123')
  console.log('   Buyer:  buyer@findsolace.gh / buyer123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
