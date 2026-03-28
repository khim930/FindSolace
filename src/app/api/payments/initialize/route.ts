export const dynamic = 'force-dynamic'
// src/app/api/payments/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { initializePayment } from '@/lib/paystack'

export async function POST(req: NextRequest) {
  try {
    const { orderId, reference, email, amountGHS, metadata } = await req.json()

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback?orderId=${orderId}`

    const result = await initializePayment({
      email,
      amountGHS,
      reference,
      callbackUrl,
      metadata,
      channels: ['card', 'mobile_money'],
    })

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[POST /api/payments/initialize]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
