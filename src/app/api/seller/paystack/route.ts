// src/app/api/seller/paystack/route.ts
// Seller submits their Paystack details to enable split payments
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSubaccount } from '@/lib/paystack'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sellerId = (session.user as any).sellerId
  if (!sellerId) return NextResponse.json({ error: 'Seller account required' }, { status: 403 })

  try {
    const { businessName, bankCode, accountNumber } = await req.json()

    if (!businessName || !bankCode || !accountNumber)
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })

    const seller = await db.sellerProfile.findUnique({ where: { id: sellerId } })
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

    // Create subaccount on Paystack with seller's current commission rate
    const subaccount = await createSubaccount({
      businessName,
      bankCode,
      accountNumber,
      percentageCharge: seller.commissionRate, // platform keeps this %
    })

    // Save subaccount code to seller profile
    await db.sellerProfile.update({
      where: { id: sellerId },
      data: {
        paystackSubaccountCode: subaccount.subaccount_code,
        paystackBankCode:       bankCode,
        paystackAccountNumber:  accountNumber,
        paystackVerified:       true,
        momoNumber:             accountNumber,
      },
    })

    return NextResponse.json({
      success:         true,
      subaccountCode:  subaccount.subaccount_code,
      message:         'Paystack split payments enabled! You will now receive your share automatically after each sale.',
    })
  } catch (err: any) {
    console.error('[POST /api/seller/paystack]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sellerId = (session.user as any).sellerId
  const seller   = await db.sellerProfile.findUnique({
    where:  { id: sellerId },
    select: {
      paystackSubaccountCode: true,
      paystackVerified:       true,
      paystackBankCode:       true,
      commissionRate:         true,
      momoNumber:             true,
    },
  })

  return NextResponse.json(seller)
}
