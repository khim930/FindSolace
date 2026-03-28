// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateProductSEO } from '@/lib/ai'

// GET /api/products — public product listing with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q        = searchParams.get('q')
  const category = searchParams.get('category')
  const sellerId = searchParams.get('sellerId')
  const sort     = searchParams.get('sort') ?? 'newest'
  const page     = parseInt(searchParams.get('page') ?? '1')
  const limit    = parseInt(searchParams.get('limit') ?? '24')

  const where: any = { status: 'ACTIVE' }
  if (q)        where.title    = { contains: q, mode: 'insensitive' }
  if (category) where.category = { slug: category }
  if (sellerId) where.sellerId = sellerId

  const orderBy: any =
    sort === 'price_asc'  ? { price: 'asc' }   :
    sort === 'price_desc' ? { price: 'desc' }  :
    sort === 'popular'    ? { views: 'desc' }   :
    { createdAt: 'desc' }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where, orderBy,
      include: {
        seller:   { select: { shopName: true } },
        category: { select: { name: true, slug: true } },
        reviews:  { select: { rating: true } },
      },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    db.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
}

// POST /api/products — create product (sellers only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sellerId = (session.user as any).sellerId
  if (!sellerId) return NextResponse.json({ error: 'Seller account required' }, { status: 403 })

  try {
    const body = await req.json()
    const { title, categoryId, price, comparePrice, stockQty, keyFeatures, images } = body

    // Validate required fields
    if (!title || !categoryId || !price || !stockQty)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    // Generate SEO content via AI
    const category = await db.category.findUnique({ where: { id: categoryId } })
    const seo = await generateProductSEO({
      title,
      category: category?.name ?? 'General',
      keyFeatures,
      price,
    })

    // Generate unique slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const existing = await db.product.count({ where: { slug: { startsWith: baseSlug } } })
    const slug     = existing ? `${baseSlug}-${existing + 1}` : baseSlug

    const product = await db.product.create({
      data: {
        sellerId,
        categoryId,
        title,
        slug,
        description: seo.description,
        metaTitle:   seo.metaTitle,
        metaTags:    seo.metaTags,
        price:       parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stockQty:    parseInt(stockQty),
        images:      images ?? [],
        status:      'ACTIVE',
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err: any) {
    console.error('[POST /api/products]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
