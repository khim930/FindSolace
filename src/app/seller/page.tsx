// src/app/seller/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { SellerDashboard } from '@/components/seller/SellerDashboard'

export default async function SellerPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const sellerId = (session.user as any).sellerId
  if (!sellerId) redirect('/login?tab=signup')

  const [profile, products, orders, commissions] = await Promise.all([
    db.sellerProfile.findUnique({
      where: { id: sellerId },
      include: { user: { select: { fullName: true, email: true } } },
    }),
    db.product.findMany({
      where:   { sellerId },
      include: { category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    db.order.findMany({
      where:   { items: { some: { sellerId } } },
      include: { items: { where: { sellerId }, include: { product: { select: { title: true } } } }, buyer: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
      take:    20,
    }),
    db.commission.findMany({
      where:   { sellerId },
      orderBy: { createdAt: 'desc' },
      take:    10,
    }),
    db.category.findMany({ where: { isActive: true } }),
  ])

  if (!profile) redirect('/')

  const categories = await db.category.findMany({ where: { isActive: true } })

  return (
    <SellerDashboard
      profile={profile}
      products={products}
      orders={orders}
      commissions={commissions}
      categories={categories}
    />
  )
}
