// src/app/admin/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const [sellers, orders, commissions, sponsored, stats] = await Promise.all([
    db.sellerProfile.findMany({ include: { user: { select: { fullName: true, email: true } } }, orderBy: { createdAt: 'desc' } }),
    db.order.findMany({ include: { buyer: { select: { fullName: true } }, items: { include: { product: { select: { title: true } } } } }, orderBy: { createdAt: 'desc' }, take: 50 }),
    db.commission.findMany({ include: { seller: { select: { shopName: true } } }, orderBy: { createdAt: 'desc' }, take: 30 }),
    db.sponsoredContent.findMany({ include: { seller: { select: { shopName: true } } }, orderBy: { createdAt: 'desc' } }),
    Promise.all([
      db.order.aggregate({ _sum: { totalAmount: true } }),
      db.sellerProfile.count({ where: { status: 'ACTIVE' } }),
      db.order.count(),
      db.commission.aggregate({ _sum: { commissionAmount: true } }),
    ]),
  ])

  const [gmvAgg, activeSellers, totalOrders, commAgg] = stats

  return (
    <AdminDashboard
      sellers={sellers}
      orders={orders}
      commissions={commissions}
      sponsored={sponsored}
      metrics={{
        gmv:         gmvAgg._sum.totalAmount ?? 0,
        sellers:     activeSellers,
        orders:      totalOrders,
        commissions: commAgg._sum.commissionAmount ?? 0,
      }}
    />
  )
}
