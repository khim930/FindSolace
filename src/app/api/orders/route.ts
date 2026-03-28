export const dynamic = 'force-dynamic'
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateCommission, getSellerTier } from '@/lib/commission'
import { generateReference } from '@/lib/paystack'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    // Allow guest checkout (buyerId will be null) or require session
    const body = await req.json()
    const { items, shippingAddress, subtotal, shippingFee, platformFee, totalAmount } = body

    if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })

    // Create order + items + commissions in one transaction
    const order = await db.$transaction(async (tx) => {

      const newOrder = await tx.order.create({
        data: {
          buyerId:         (session?.user as any)?.id ?? 'guest',
          subtotal,
          shippingFee,
          platformFee,
          totalAmount,
          shippingAddress,
          status:          'PENDING',
          trackingNumber:  `FS-${Date.now().toString(36).toUpperCase()}`,
        },
      })

      for (const item of items) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId:   newOrder.id,
            productId: item.productId,
            sellerId:  item.sellerId,
            quantity:  item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.quantity * item.unitPrice,
          },
        })

        // Calculate commission for this seller
        const sellerProfile = await tx.sellerProfile.findUnique({
          where: { id: item.sellerId },
          select: { totalEarnings: true, commissionRate: true },
        })

        const monthlyRevenue = sellerProfile?.totalEarnings ?? 0
        const breakdown = calculateCommission(orderItem.lineTotal, monthlyRevenue)

        await tx.commission.create({
          data: {
            orderItemId:      orderItem.id,
            sellerId:         item.sellerId,
            saleAmount:       breakdown.saleAmount,
            commissionRate:   breakdown.commissionRate,
            commissionAmount: breakdown.commissionAmount,
            sellerPayout:     breakdown.sellerPayout,
            status:           'PENDING',
          },
        })

        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data:  { stockQty: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    const reference = generateReference(order.id)

    // Save payment reference to order
    await db.order.update({ where: { id: order.id }, data: { paymentRef: reference } })

    return NextResponse.json({ orderId: order.id, reference, trackingNumber: order.trackingNumber })
  } catch (err: any) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const orders = await db.order.findMany({
    where:   { buyerId: userId },
    include: { items: { include: { product: { select: { title: true, images: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
