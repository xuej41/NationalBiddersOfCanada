import Link from "next/link"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Bidding Platform",
  description: "A platform for online auctions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Bidding Platform
            </Link>
            <div className="space-x-4">
              <Link href="/items" className="hover:text-gray-300">
                View Items
              </Link>
              <Link href="/admin/submit-item" className="hover:text-gray-300">
                List Item
              </Link>
              <Link href="/sign-in" className="hover:text-gray-300">
                Sign In
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

