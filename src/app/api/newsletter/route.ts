export const dynamic = 'force-dynamic'
// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@'))
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    await db.newsletterSubscriber.upsert({
      where:  { email },
      update: {},
      create: { email },
    })

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
