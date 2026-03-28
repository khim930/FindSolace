// src/app/api/upload/signature/route.ts
// Returns a signed Cloudinary upload credential so browsers can upload directly
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUploadSignature } from '@/lib/cloudinary'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const sig = await getUploadSignature()
    return NextResponse.json(sig)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
