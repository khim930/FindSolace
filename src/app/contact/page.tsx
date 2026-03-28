'use client'
// src/app/contact/page.tsx
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General enquiry', message: '' })
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success("Message sent! We'll reply within 24 hours.")
    setForm({ name: '', email: '', subject: 'General enquiry', message: '' })
    setSending(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact us</h1>
      <p className="text-gray-500 text-sm mb-8">We typically reply within 24 hours.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[['📧','Email','hello@findsolace.gh'],['💬','WhatsApp','+233 24 000 0000'],['📍','Office','Accra, Ghana']].map(([icon, label, val]) => (
          <div key={label} className="card p-4 text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
            <div className="text-sm text-blue-600 font-medium">{val}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your name *</label>
            <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email address *</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
          <select className="input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
            {['General enquiry','Seller support','Order issue','Report a problem','Partnership'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Message *</label>
          <textarea className="input resize-none" rows={5} placeholder="How can we help you?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
        </div>
        <button type="submit" disabled={sending} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {sending ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</> : 'Send message'}
        </button>
      </form>
    </div>
  )
}
