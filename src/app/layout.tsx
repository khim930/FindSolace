// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title:       { default: "FindSolace — Find what you need, close to home", template: "%s | FindSolace" },
  description: "Ghana's marketplace connecting local buyers and sellers. Electronics, fashion, food & more.",
  keywords:    ["ghana marketplace", "buy online ghana", "sell online ghana", "findsolace", "accra shopping"],
  openGraph: {
    title:       "FindSolace — Find what you need, close to home",
    description: "Find what you need, close to home. Ghana's local marketplace.",
    url:         "https://findsolace.gh",
    siteName:    "FindSolace",
    locale:      "en_GH",
    type:        "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
