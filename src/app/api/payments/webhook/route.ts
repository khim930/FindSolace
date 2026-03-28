// src/app/api/payments/webhook/route.ts
// Paystack sends POST here on every payment event — more reliable than redirect callback

import { NextRequest, NextResponse } from 'next/server'
import { validateWebhookSignature } from '@/lib/paystack'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-paystack-signature') ?? ''
  const body      = await req.text()

  if (!validateWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === 'charge.success') {
    const { reference, metadata } = event.data
    const orderId = metadata?.orderId

    if (orderId) {
      await db.order.updateMany({
        where: { id: orderId, status: 'PENDING' },
        data: {
          status:        'CONFIRMED',
          paymentRef:    reference,
          paymentMethod: event.data.channel,
          paidAt:        new Date(event.data.paid_at),
        },
      })
    }
  }

  if (event.event === 'charge.dispute.create') {
    const orderId = event.data.transaction?.metadata?.orderId
    if (orderId) {
      await db.order.updateMany({ where: { id: orderId }, data: { status: 'DISPUTED' } })
    }
  }

  return NextResponse.json({ received: true })
}
