import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mostasmer',
  description: 'estthmar app',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/icon.png',
        sizes: '256x256',
        type: 'image/png',
      }
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/chat" className="text-gray-700 hover:text-gray-900">
                  Chat
                </Link>
              </div>
            </div>
          </div>
        </nav> */}
        {children}
      </body>
    </html>
  )
} 