// src/app/api/admin/sellers/[id]/commission/route.ts
// Admin sets a custom commission rate per seller
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateSubaccountRate } from '@/lib/paystack'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { commissionRate } = await req.json()

    if (commissionRate < 0 || commissionRate > 50)
      return NextResponse.json({ error: 'Commission rate must be between 0% and 50%' }, { status: 400 })

    const seller = await db.sellerProfile.findUnique({ where: { id: params.id } })
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })

    // Update in our database
    await db.sellerProfile.update({
      where: { id: params.id },
      data:  { commissionRate },
    })

    // If seller has a Paystack subaccount, sync the rate there too
    if (seller.paystackSubaccountCode && seller.paystackVerified) {
      await updateSubaccountRate(seller.paystackSubaccountCode, commissionRate)
    }

    return NextResponse.json({ success: true, commissionRate })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
