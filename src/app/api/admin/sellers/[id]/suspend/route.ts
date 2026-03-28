// src/app/api/admin/sellers/[id]/suspend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await db.sellerProfile.update({
    where: { id: params.id },
    data:  { status: 'SUSPENDED' },
  })

  return NextResponse.json({ success: true })
}
