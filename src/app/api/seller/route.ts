// src/app/api/admin/sellers/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET — list all sellers with their commission rates and paystack status
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const sellers = await db.sellerProfile.findMany({
    include: { user: { select: { fullName: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(sellers)
}

// PATCH — update a seller's commission rate
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { sellerId, commissionRate } = await req.json()

  const seller = await db.sellerProfile.update({
    where: { id: sellerId },
    data:  { commissionRate: parseFloat(commissionRate) },
  })

  return NextResponse.json(seller)
}
