// src/app/api/payments/initialize/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { initializePayment } from '@/lib/paystack'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { orderId, reference, email, amountGHS, metadata, sellerId } = await req.json()

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?orderId=${orderId}`

    // Look up seller's Paystack subaccount if they have one
    let subaccountCode: string | undefined
    if (sellerId) {
      const seller = await db.sellerProfile.findUnique({
        where:  { id: sellerId },
        select: { paystackSubaccountCode: true, paystackVerified: true },
      })
      if (seller?.paystackVerified && seller.paystackSubaccountCode) {
        subaccountCode = seller.paystackSubaccountCode
      }
    }

    // For multi-seller orders, use the first seller's subaccount
    // (Advanced: use Paystack Multi-Split for multiple sellers in one order)
    if (!subaccountCode && orderId) {
      const order = await db.order.findUnique({
        where:   { id: orderId },
        include: {
          items: {
            take: 1,
            include: {
              seller: {
                select: { paystackSubaccountCode: true, paystackVerified: true },
              },
            },
          },
        },
      })
      const firstSeller = order?.items[0]?.seller
      if (firstSeller?.paystackVerified && firstSeller.paystackSubaccountCode) {
        subaccountCode = firstSeller.paystackSubaccountCode
      }
    }

    const result = await initializePayment({
      email,
      amountGHS,
      reference,
      callbackUrl,
      subaccountCode,
      metadata,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[POST /api/payments/initialize]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
