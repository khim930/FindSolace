// src/lib/paystack.ts
// Paystack integration — Ghana payments: MTN MoMo, Vodafone Cash, Cards
// Docs: https://paystack.com/docs/api

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_BASE   = 'https://api.paystack.co'

const headers = {
  Authorization: `Bearer ${PAYSTACK_SECRET}`,
  'Content-Type': 'application/json',
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type PaystackChannel = 'card' | 'mobile_money' | 'bank' | 'ussd'

export interface InitializePaymentParams {
  email:        string
  amountGHS:    number        // amount in Ghana Cedis — we convert to pesewas
  reference:    string        // unique order reference
  callbackUrl:  string        // redirect after payment
  metadata?: {
    orderId:     string
    buyerName:   string
    cartItems:   { title: string; quantity: number; price: number }[]
  }
  channels?: PaystackChannel[]
}

export interface PaystackTransaction {
  id:          number
  reference:   string
  amount:      number
  status:      'success' | 'failed' | 'abandoned' | 'pending'
  channel:     string
  currency:    string
  paid_at:     string
  customer: {
    email:      string
    first_name: string
    last_name:  string
    phone:      string
  }
}

// ─── Initialize a payment ─────────────────────────────────────────────────────

export async function initializePayment(params: InitializePaymentParams) {
  const amountInPesewas = Math.round(params.amountGHS * 100)

  const body = {
    email:        params.email,
    amount:       amountInPesewas,
    reference:    params.reference,
    callback_url: params.callbackUrl,
    currency:     'GHS',
    channels:     params.channels ?? ['card', 'mobile_money'],
    metadata:     params.metadata ?? {},
  }

  const res  = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await res.json()

  if (!data.status) throw new Error(data.message || 'Failed to initialize payment')

  return {
    authorizationUrl: data.data.authorization_url as string,
    accessCode:       data.data.access_code as string,
    reference:        data.data.reference as string,
  }
}

// ─── Verify a payment ─────────────────────────────────────────────────────────

export async function verifyPayment(reference: string): Promise<PaystackTransaction> {
  const res  = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, { headers })
  const data = await res.json()

  if (!data.status) throw new Error(data.message || 'Failed to verify payment')

  return data.data as PaystackTransaction
}

// ─── List transactions (admin) ────────────────────────────────────────────────

export async function listTransactions(page = 1, perPage = 50) {
  const res  = await fetch(`${PAYSTACK_BASE}/transaction?page=${page}&perPage=${perPage}`, { headers })
  const data = await res.json()
  return data.data
}

// ─── Generate unique order reference ─────────────────────────────────────────

export function generateReference(orderId: string): string {
  const ts = Date.now().toString(36).toUpperCase()
  return `FS-${ts}-${orderId.slice(-6).toUpperCase()}`
}

// ─── Validate Paystack webhook signature ──────────────────────────────────────

export function validateWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require('crypto')
  const hash   = crypto.createHmac('sha512', PAYSTACK_SECRET).update(payload).digest('hex')
  return hash === signature
}
