'use client'
// src/components/seller/SellerDashboard.tsx

import { useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface Props {
  profile: any; products: any[]; orders: any[]
  commissions: any[]; categories: any[]
}

const TABS = [
  { id: 'overview',  label: '📊 Overview' },
  { id: 'products',  label: '📦 My products' },
  { id: 'add',       label: '➕ Add product' },
  { id: 'orders',    label: '🛒 Orders' },
  { id: 'earnings',  label: '💰 Earnings' },
  { id: 'profile',   label: '🏪 Shop profile' },
]

export function SellerDashboard({ profile, products, orders, commissions, categories }: Props) {
  const [tab, setTab] = useState('overview')
  const [form, setForm] = useState({ title: '', categoryId: '', price: '', comparePrice: '', stockQty: '', keyFeatures: '', description: '' })
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  const totalSales = commissions.reduce((s, c) => s + c.saleAmount, 0)
  const totalEarned = commissions.reduce((s, c) => s + c.sellerPayout, 0)

  async function generateDescription() {
    if (!form.title) { toast.error('Enter a product title first'); return }
    setGenerating(true)
    try {
      const res  = await fetch('/api/products/generate-seo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, categoryId: form.categoryId, keyFeatures: form.keyFeatures, price: form.price }),
      })
      const data = await res.json()
      setForm(f => ({ ...f, description: data.description }))
      toast.success('AI description generated!')
    } catch { toast.error('Failed to generate description') }
    finally { setGenerating(false) }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res  = await fetch('/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images: [] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Product published!')
      setForm({ title: '', categoryId: '', price: '', comparePrice: '', stockQty: '', keyFeatures: '', description: '' })
      setTab('products')
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const statusColor: Record<string, string> = {
    PENDING: 'badge-amber', CONFIRMED: 'badge-blue', PROCESSING: 'badge-blue',
    SHIPPED: 'badge-green', DELIVERED: 'badge-green', CANCELLED: 'badge-red', DISPUTED: 'badge-red',
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-52 border-r border-gray-200 bg-white shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Seller hub</div>
          <div className="text-sm font-medium text-gray-900 truncate">{profile.shopName}</div>
          <span className={`badge text-xs mt-1 ${profile.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}`}>
            {profile.status.toLowerCase()}
          </span>
        </div>
        <nav className="flex-1 py-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 border-l-2 transition-colors ${tab === t.id ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tab bar */}
      <div className="sm:hidden flex overflow-x-auto border-b border-gray-200 bg-white w-full fixed top-14 z-10">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2.5 text-xs border-b-2 transition-colors ${tab === t.id ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 bg-gray-50 p-4 sm:p-6 mt-10 sm:mt-0">

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-lg font-semibold mb-5">Welcome back, {profile.user.fullName.split(' ')[0]}!</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total sales', value: `GH₵ ${totalSales.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` },
                { label: 'Orders', value: orders.length },
                { label: 'Products', value: products.length },
                { label: 'Pending payout', value: `GH₵ ${profile.pendingPayout.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                </div>
              ))}
            </div>
            {profile.pendingPayout > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 mb-6">
                💰 Next payout: <strong>GH₵ {profile.pendingPayout.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</strong> · Every Friday via {profile.momoNumber ? 'MTN MoMo' : 'registered payment method'}
              </div>
            )}
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent orders</h2>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Order','Buyer','Product','Amount','Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.trackingNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{o.buyer?.fullName ?? 'Guest'}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{o.items[0]?.product?.title}</td>
                      <td className="px-4 py-3 font-medium">GH₵ {o.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3"><span className={`badge ${statusColor[o.status] ?? 'badge-blue'}`}>{o.status.toLowerCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── My products ── */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-lg font-semibold">My products ({products.length})</h1>
              <button onClick={() => setTab('add')} className="btn-primary text-sm">+ Add product</button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Product','Category','Price','Stock','Status',''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const imgs = Array.isArray(p.images) ? p.images : []
                    return (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg overflow-hidden shrink-0">
                              {imgs[0]?.thumbnail ? <Image src={imgs[0].thumbnail} alt={p.title} width={40} height={40} className="object-cover" /> : '🛍️'}
                            </div>
                            <span className="font-medium text-gray-900 max-w-[180px] truncate">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{p.category.name}</td>
                        <td className="px-4 py-3 font-medium text-blue-600">GH₵ {p.price.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-gray-600">{p.stockQty}</td>
                        <td className="px-4 py-3"><span className={`badge ${p.status === 'ACTIVE' ? 'badge-green' : p.status === 'DRAFT' ? 'badge-amber' : 'badge-red'}`}>{p.status.toLowerCase()}</span></td>
                        <td className="px-4 py-3"><button className="text-xs text-blue-600 hover:underline">Edit</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Add product ── */}
        {tab === 'add' && (
          <div className="max-w-2xl">
            <h1 className="text-lg font-semibold mb-5">Add new product</h1>
            <form onSubmit={handleAddProduct} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Product title *</label>
                <input className="input" placeholder="e.g. Samsung Galaxy A55 128GB" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                  <select className="input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                    <option value="">Select category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Price (GH₵) *</label>
                  <input className="input" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Compare-at price</label>
                  <input className="input" type="number" step="0.01" placeholder="Optional (crossed-out price)" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Stock quantity *</label>
                  <input className="input" type="number" placeholder="0" value={form.stockQty} onChange={e => setForm(f => ({ ...f, stockQty: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Key features (optional)</label>
                <input className="input" placeholder="e.g. 6.4 inch screen, 50MP camera, 5000mAh battery" value={form.keyFeatures} onChange={e => setForm(f => ({ ...f, keyFeatures: e.target.value }))} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-600">Description *</label>
                  <button type="button" onClick={generateDescription} disabled={generating} className="text-xs text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-50">
                    {generating ? '⏳ Generating...' : '✨ Generate with AI'}
                  </button>
                </div>
                <textarea className="input resize-none" rows={5} placeholder="Describe your product in detail..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : 'Publish product'}
                </button>
                <button type="button" onClick={() => setTab('products')} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <div>
            <h1 className="text-lg font-semibold mb-5">Orders ({orders.length})</h1>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Order ID','Buyer','Items','Total','Date','Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.trackingNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{o.buyer?.fullName ?? 'Guest'}</td>
                      <td className="px-4 py-3 text-gray-600">{o.items.map((i: any) => i.product.title).join(', ').slice(0, 40)}...</td>
                      <td className="px-4 py-3 font-medium">GH₵ {o.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-GH')}</td>
                      <td className="px-4 py-3"><span className={`badge ${statusColor[o.status] ?? 'badge-blue'}`}>{o.status.toLowerCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Earnings ── */}
        {tab === 'earnings' && (
          <div>
            <h1 className="text-lg font-semibold mb-5">Earnings & payouts</h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total earned', value: `GH₵ ${totalEarned.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` },
                { label: 'Pending payout', value: `GH₵ ${profile.pendingPayout.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` },
                { label: 'Commission paid', value: `GH₵ ${(totalSales - totalEarned).toLocaleString('en-GH', { minimumFractionDigits: 2 })}` },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Sale','Commission rate','You earned','Status','Date'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {commissions.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">GH₵ {c.saleAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-gray-500">{c.commissionRate}%</td>
                      <td className="px-4 py-3 font-medium text-green-600">GH₵ {c.sellerPayout.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3"><span className={`badge ${c.status === 'SETTLED' ? 'badge-green' : 'badge-amber'}`}>{c.status.toLowerCase()}</span></td>
                      <td className="px-4 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString('en-GH')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Shop profile ── */}
        {tab === 'profile' && (
          <div className="max-w-xl">
            <h1 className="text-lg font-semibold mb-5">Shop profile</h1>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Shop name</label>
                <input className="input" defaultValue={profile.shopName} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Shop description</label>
                <textarea className="input resize-none" rows={3} defaultValue={profile.shopDescription ?? ''} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                  <input className="input" defaultValue={profile.user?.location ?? 'Ghana'} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">MoMo number (payouts)</label>
                  <input className="input" placeholder="+233 24 000 0000" defaultValue={profile.momoNumber ?? ''} />
                </div>
              </div>
              <button onClick={() => toast.success('Profile updated!')} className="btn-primary">Save changes</button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
