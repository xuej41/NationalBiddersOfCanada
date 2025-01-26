import Link from "next/link"
import "./globals.css"
import { Inter, Poppins } from "next/font/google"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"]})

export const metadata = {
  title: "National Bid Canada",
  description: "Queen's leading live auction site",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-100`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

