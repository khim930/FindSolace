'use client'
// src/components/admin/AdminDashboard.tsx

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  sellers: any[]; orders: any[]; commissions: any[]
  sponsored: any[]; metrics: { gmv: number; sellers: number; orders: number; commissions: number }
}

const TABS = [
  { id: 'overview',     label: '📊 Overview' },
  { id: 'sellers',      label: '🏪 Sellers' },
  { id: 'orders',       label: '📦 Orders' },
  { id: 'commissions',  label: '💸 Commissions' },
  { id: 'sponsored',    label: '📰 Sponsored' },
  { id: 'settings',     label: '⚙️ Settings' },
]

const statusBadge: Record<string, string> = {
  ACTIVE: 'badge-green', PENDING: 'badge-amber', SUSPENDED: 'badge-red',
  CONFIRMED: 'badge-blue', SHIPPED: 'badge-green', DELIVERED: 'badge-green',
  CANCELLED: 'badge-red', DISPUTED: 'badge-red', SETTLED: 'badge-green',
  LIVE: 'badge-green', EXPIRED: 'badge-red', REJECTED: 'badge-red',
}

export function AdminDashboard({ sellers, orders, commissions, sponsored, metrics }: Props) {
  const [tab, setTab] = useState('overview')

  async function approveSeller(id: string) {
    await fetch(`/api/admin/sellers/${id}/approve`, { method: 'POST' })
    toast.success('Seller approved!')
  }

  async function suspendSeller(id: string) {
    await fetch(`/api/admin/sellers/${id}/suspend`, { method: 'POST' })
    toast.success('Seller suspended')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-52 border-r border-gray-200 bg-white shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Admin panel</div>
          <div className="text-sm font-medium text-gray-900">FindSolace</div>
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

      <main className="flex-1 bg-gray-50 p-4 sm:p-6">

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-lg font-semibold mb-5">Platform overview</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total GMV', value: `GH₵ ${metrics.gmv.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` },
                { label: 'Active sellers', value: metrics.sellers },
                { label: 'Total orders', value: metrics.orders },
                { label: 'Commission earned', value: `GH₵ ${metrics.commissions.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold mb-3">Pending seller approvals</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  {sellers.filter(s => s.status === 'PENDING').length === 0 ? (
                    <div className="px-4 py-6 text-sm text-gray-400 text-center">No pending approvals</div>
                  ) : sellers.filter(s => s.status === 'PENDING').map(s => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium">{s.shopName}</div>
                        <div className="text-xs text-gray-400">{s.user.email}</div>
                      </div>
                      <button onClick={() => approveSeller(s.id)} className="btn-primary text-xs py-1.5 px-3">Approve</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-semibold mb-3">Recent orders</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="text-sm font-medium font-mono">{o.trackingNumber}</div>
                        <div className="text-xs text-gray-400">{o.buyer?.fullName ?? 'Guest'} · GH₵ {o.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</div>
                      </div>
                      <span className={`badge text-xs ${statusBadge[o.status] ?? 'badge-blue'}`}>{o.status.toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Sellers ── */}
        {tab === 'sellers' && (
          <div>
            <h1 className="text-lg font-semibold mb-5">All sellers ({sellers.length})</h1>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Shop','Seller','Email','Commission','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {sellers.map(s => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{s.shopName}</td>
                      <td className="px-4 py-3 text-gray-600">{s.user.fullName}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.user.email}</td>
                      <td className="px-4 py-3 text-gray-600">{s.commissionRate}%</td>
                      <td className="px-4 py-3"><span className={`badge ${statusBadge[s.status] ?? 'badge-blue'}`}>{s.status.toLowerCase()}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {s.status === 'PENDING' && <button onClick={() => approveSeller(s.id)} className="text-xs text-green-600 hover:underline">Approve</button>}
                          {s.status === 'ACTIVE' && <button onClick={() => suspendSeller(s.id)} className="text-xs text-red-400 hover:underline">Suspend</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <div>
            <h1 className="text-lg font-semibold mb-5">All orders ({orders.length})</h1>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Order','Buyer','Total','Method','Date','Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.trackingNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{o.buyer?.fullName ?? 'Guest'}</td>
                      <td className="px-4 py-3 font-medium">GH₵ {o.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{o.paymentMethod ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-GH')}</td>
                      <td className="px-4 py-3"><span className={`badge ${statusBadge[o.status] ?? 'badge-blue'}`}>{o.status.toLowerCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Commissions ── */}
        {tab === 'commissions' && (
          <div>
            <h1 className="text-lg font-semibold mb-5">Commission tracking</h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Total collected</div>
                <div className="text-xl font-bold">GH₵ {metrics.commissions.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Pending settlement</div>
                <div className="text-xl font-bold">GH₵ {commissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commissionAmount, 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Transactions</div>
                <div className="text-xl font-bold">{commissions.length}</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Seller','Sale amount','Rate','Commission','Seller payout','Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {commissions.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{c.seller.shopName}</td>
                      <td className="px-4 py-3">GH₵ {c.saleAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-gray-500">{c.commissionRate}%</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">GH₵ {c.commissionAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">GH₵ {c.sellerPayout.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3"><span className={`badge ${statusBadge[c.status] ?? 'badge-blue'}`}>{c.status.toLowerCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Sponsored ── */}
        {tab === 'sponsored' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-lg font-semibold">Sponsored content ({sponsored.length})</h1>
              <button onClick={() => toast.success('Sponsorship form coming soon!')} className="btn-primary text-sm">+ New slot</button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Brand','Title','Type','Amount','Dates','Status'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {sponsored.map(s => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{s.seller.shopName}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{s.title}</td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{s.type.toLowerCase()}</td>
                      <td className="px-4 py-3 font-medium">GH₵ {s.amountPaid.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.startDate).toLocaleDateString('en-GH')} – {new Date(s.endDate).toLocaleDateString('en-GH')}</td>
                      <td className="px-4 py-3"><span className={`badge ${statusBadge[s.status] ?? 'badge-blue'}`}>{s.status.toLowerCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {tab === 'settings' && (
          <div className="max-w-xl">
            <h1 className="text-lg font-semibold mb-5">Platform settings</h1>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Platform name</label>
                  <input className="input" defaultValue="FindSolace" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Default commission (%)</label>
                  <input className="input" type="number" defaultValue="5" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Starter tier limit (GH₵/month)</label>
                  <input className="input" type="number" defaultValue="500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Payout day</label>
                  <select className="input"><option>Friday</option><option>Monday</option><option>Wednesday</option></select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Support email</label>
                <input className="input" defaultValue="hello@findsolace.gh" />
              </div>
              <button onClick={() => toast.success('Settings saved!')} className="btn-primary">Save settings</button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
