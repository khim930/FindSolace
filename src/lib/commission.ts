// src/lib/commission.ts
// Commission calculation for FindSolace's tiered revenue model

export type SellerTier = 'starter' | 'growth' | 'pro' | 'enterprise'

export interface CommissionBreakdown {
  tier:             SellerTier
  saleAmount:       number
  commissionRate:   number
  commissionAmount: number
  sellerPayout:     number
  platformFee:      number   // 2% buyer-side platform fee
}

// Tier thresholds (monthly sales in GH₵)
const TIERS = [
  { name: 'starter'    as SellerTier, maxMonthly: 500,    rate: 0    },
  { name: 'growth'     as SellerTier, maxMonthly: 5000,   rate: 0.05 },
  { name: 'pro'        as SellerTier, maxMonthly: 20000,  rate: 0.07 },
  { name: 'enterprise' as SellerTier, maxMonthly: Infinity, rate: 0.03 },
]

export function getSellerTier(monthlyRevenue: number): SellerTier {
  for (const tier of TIERS) {
    if (monthlyRevenue <= tier.maxMonthly) return tier.name
  }
  return 'enterprise'
}

export function calculateCommission(
  saleAmount: number,
  monthlyRevenue: number
): CommissionBreakdown {
  const tier = TIERS.find(t => monthlyRevenue <= t.maxMonthly) ?? TIERS[3]
  const commissionAmount = Math.round(saleAmount * tier.rate * 100) / 100
  const sellerPayout     = Math.round((saleAmount - commissionAmount) * 100) / 100
  const platformFee      = Math.round(saleAmount * 0.02 * 100) / 100

  return {
    tier:             tier.name,
    saleAmount,
    commissionRate:   tier.rate * 100,
    commissionAmount,
    sellerPayout,
    platformFee,
  }
}

// Cart-level platform fee (charged to buyer, not seller)
export function calculateOrderFees(subtotal: number) {
  const shippingFee = 20
  const platformFee = Math.round(subtotal * 0.02 * 100) / 100
  const total       = Math.round((subtotal + shippingFee + platformFee) * 100) / 100
  return { subtotal, shippingFee, platformFee, total }
}
