export const dynamic = 'force-dynamic'
// src/app/api/payments/callback/route.ts
// Paystack redirects here after payment attempt

import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { verifyPayment } from '@/lib/paystack'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const reference = searchParams.get('reference')
  const orderId   = searchParams.get('orderId')

  if (!reference || !orderId) {
    return redirect('/cart?error=missing_reference')
  }

  try {
    const transaction = await verifyPayment(reference)

    if (transaction.status === 'success') {
      // Mark order as confirmed and record payment details
      await db.order.update({
        where: { id: orderId },
        data: {
          status:        'CONFIRMED',
          paymentRef:    reference,
          paymentMethod: transaction.channel,
          paidAt:        new Date(transaction.paid_at),
        },
      })

      // Update seller pending payouts
      const commissions = await db.commission.findMany({
        where: { orderItem: { orderId }, status: 'PENDING' },
      })

      for (const c of commissions) {
        await db.sellerProfile.update({
          where: { id: c.sellerId },
          data: {
            pendingPayout:  { increment: c.sellerPayout },
            totalEarnings:  { increment: c.saleAmount },
          },
        })
      }

      return redirect(`/checkout/success?order=${orderId}`)
    } else {
      await db.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } })
      return redirect(`/cart?error=payment_failed`)
    }
  } catch (err) {
    console.error('[Payment callback]', err)
    return redirect('/cart?error=verification_failed')
  }
}
