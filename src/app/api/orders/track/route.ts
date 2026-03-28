export const dynamic = 'force-dynamic'
// src/app/api/orders/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const ref = new URL(req.url).searchParams.get('ref')
  if (!ref) return NextResponse.json({ error: 'Order reference required' }, { status: 400 })

  const order = await db.order.findFirst({
    where: {
      OR: [
        { trackingNumber: ref },
        { paymentRef:     ref },
      ],
    },
    include: {
      items: {
        include: { product: { select: { title: true, images: true } } },
      },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order not found. Check your order number and try again.' }, { status: 404 })

  return NextResponse.json(order)
}
