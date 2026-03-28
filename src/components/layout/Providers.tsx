'use client'
// src/components/layout/Providers.tsx

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style:   { fontSize: '13px', borderRadius: '10px' },
          success: { iconTheme: { primary: '#185FA5', secondary: '#fff' } },
        }}
      />
    </SessionProvider>
  )
}
