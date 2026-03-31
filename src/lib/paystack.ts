// src/lib/paystack.ts
// Paystack integration with Split Payment support
// Docs: https://paystack.com/docs/payments/split-payments

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!
const BASE = 'https://api.paystack.co'

const headers = {
  Authorization: `Bearer ${PAYSTACK_SECRET}`,
  'Content-Type': 'application/json',
}

// ─── Create a subaccount for a seller ────────────────────────────────────────
// Call this when a seller registers and provides their Paystack details
export async function createSubaccount(params: {
  businessName:    string
  bankCode:        string   // e.g. "GH130101" for MTN MoMo
  accountNumber:   string   // MoMo number or bank account
  percentageCharge: number  // platform keeps this %, seller gets the rest
}) {
  const res  = await fetch(`${BASE}/subaccount`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      business_name:     params.businessName,
      settlement_bank:   params.bankCode,
      account_number:    params.accountNumber,
      percentage_charge: params.percentageCharge,
      description:       `FindSolace seller: ${params.businessName}`,
    }),
  })
  const data = await res.json()
  if (!data.status) throw new Error(data.message || 'Failed to create subaccount')
  return data.data as { subaccount_code: string; id: number; business_name: string }
}

// ─── Update a seller's commission rate ───────────────────────────────────────
export async function updateSubaccountRate(subaccountCode: string, percentageCharge: number) {
  const res  = await fetch(`${BASE}/subaccount/${subaccountCode}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ percentage_charge: percentageCharge }),
  })
  const data = await res.json()
  if (!data.status) throw new Error(data.message || 'Failed to update subaccount')
  return data.data
}

// ─── Initialize payment WITH split ───────────────────────────────────────────
export async function initializePayment(params: {
  email:           string
  amountGHS:       number
  reference:       string
  callbackUrl:     string
  subaccountCode?: string   // seller's Paystack subaccount — if set, split applies
  metadata?:       Record<string, any>
}) {
  const amountInPesewas = Math.round(params.amountGHS * 100)

  const body: any = {
    email:        params.email,
    amount:       amountInPesewas,
    reference:    params.reference,
    callback_url: params.callbackUrl,
    currency:     'GHS',
    channels:     ['card', 'mobile_money'],
    metadata:     params.metadata ?? {},
  }

  // If seller has a subaccount, enable split
  // "bearer": "subaccount" means seller bears transaction fees
  // "bearer": "account" means platform bears transaction fees
  if (params.subaccountCode) {
    body.subaccount = params.subaccountCode
    body.bearer     = 'subaccount'
    // transaction_charge: optional flat fee to platform in pesewas
    // percentage_charge is set on the subaccount itself
  }

  const res  = await fetch(`${BASE}/transaction/initialize`, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await res.json()
  if (!data.status) throw new Error(data.message || 'Failed to initialize payment')

  return {
    authorizationUrl: data.data.authorization_url as string,
    accessCode:       data.data.access_code as string,
    reference:        data.data.reference as string,
  }
}

// ─── Verify payment ───────────────────────────────────────────────────────────
export async function verifyPayment(reference: string) {
  const res  = await fetch(`${BASE}/transaction/verify/${reference}`, { headers })
  const data = await res.json()
  if (!data.status) throw new Error(data.message || 'Failed to verify payment')
  return data.data
}

// ─── List Ghana banks / MoMo providers ───────────────────────────────────────
// Use these codes when creating subaccounts
export async function getGhanaBanks() {
  const res  = await fetch(`${BASE}/bank?country=ghana&currency=GHS`, { headers })
  const data = await res.json()
  return data.data as { name: string; code: string; type: string }[]
}

// ─── Generate order reference ─────────────────────────────────────────────────
export function generateReference(orderId: string): string {
  const ts = Date.now().toString(36).toUpperCase()
  return `FS-${ts}-${orderId.slice(-6).toUpperCase()}`
}

// ─── Validate webhook ─────────────────────────────────────────────────────────
export function validateWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require('crypto')
  const hash   = crypto.createHmac('sha512', PAYSTACK_SECRET).update(payload).digest('hex')
  return hash === signature
}

// ─── Ghana MoMo bank codes (for subaccount creation) ─────────────────────────
export const GHANA_MOMO_CODES = {
  MTN:      'MTN',
  VODAFONE: 'VOD',
  AIRTELTIGO: 'ATL',
} as const
