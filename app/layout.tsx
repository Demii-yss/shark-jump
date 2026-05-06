import type { Metadata } from 'next'
import { Zen_Maru_Gothic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'

const zenMaruGothic = Zen_Maru_Gothic({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: '鯊魚 JUMP - 可愛漫畫世界',
  description: '歡迎來到鯊魚 JUMP 的可愛漫畫世界！認識鯊魚、玉子燒、奶茶和更多有趣的角色！',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className="bg-background">
      <body className={`${zenMaruGothic.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
