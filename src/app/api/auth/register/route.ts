// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, role, shopName } = await req.json()

    if (!fullName || !email || !password)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    if (password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

    const existing = await db.user.findUnique({ where: { email } })
    if (existing)
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const userRole     = role === 'SELLER' ? 'SELLER' : 'BUYER'

    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { fullName, email, passwordHash, role: userRole },
      })

      if (userRole === 'SELLER' && shopName) {
        await tx.sellerProfile.create({
          data: {
            userId:      newUser.id,
            shopName:    shopName.trim(),
            status:      'PENDING', // requires admin approval
            commissionRate: 0,      // starter: 0% commission
          },
        })
      }

      return newUser
    })

    return NextResponse.json({
      id:    user.id,
      email: user.email,
      role:  user.role,
      message: userRole === 'SELLER'
        ? 'Account created. Your seller profile is pending approval (usually within 24 hours).'
        : 'Account created successfully.',
    }, { status: 201 })

  } catch (err: any) {
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
