// src/app/api/products/generate-seo/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateProductSEO } from '@/lib/ai'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, categoryId, keyFeatures, price } = await req.json()
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    let categoryName = 'General'
    if (categoryId) {
      const cat = await db.category.findUnique({ where: { id: categoryId } })
      if (cat) categoryName = cat.name
    }

    const seo = await generateProductSEO({
      title,
      category: categoryName,
      keyFeatures,
      price: price ? parseFloat(price) : undefined,
    })

    return NextResponse.json(seo)
  } catch (err: any) {
    console.error('[POST /api/products/generate-seo]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
