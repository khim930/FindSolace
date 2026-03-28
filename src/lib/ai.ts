// src/lib/ai.ts
// AI-powered SEO product description generation via Anthropic Claude

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface SEOContent {
  description: string
  metaTitle:   string
  metaTags:    string[]
}

export async function generateProductSEO(params: {
  title:        string
  category:     string
  keyFeatures?: string
  price?:       number
}): Promise<SEOContent> {
  const { title, category, keyFeatures, price } = params

  const priceCtx    = price    ? `The price is GH₵ ${price.toLocaleString()}.`   : ''
  const featuresCtx = keyFeatures ? `Key features: ${keyFeatures}.` : ''

  const message = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `You are an SEO copywriter for FindSolace, Ghana's leading online marketplace.

Product details:
- Title: "${title}"
- Category: ${category}
- ${featuresCtx}
- ${priceCtx}

Write SEO content for this product listing targeting Ghanaian buyers. Return ONLY valid JSON, no markdown:
{
  "description": "3-paragraph description (150-200 words). Para 1: what it is and main benefit. Para 2: key features. Para 3: why buy on FindSolace with Ghana context.",
  "metaTitle": "Under 60 characters, includes product name and key benefit",
  "metaTags": ["5-7 lowercase SEO phrases relevant to Ghana and this product"]
}`,
    }],
  })

  const text = message.content.find(b => b.type === 'text')?.text ?? '{}'
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean) as SEOContent
  } catch {
    return {
      description: `${title} — now available on FindSolace. Quality products delivered across Ghana with buyer protection on every order.`,
      metaTitle:   `${title.slice(0, 50)} | FindSolace Ghana`,
      metaTags:    [title.toLowerCase(), category.toLowerCase(), 'buy online ghana', 'findsolace', 'accra delivery'],
    }
  }
}
