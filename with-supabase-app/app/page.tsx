import Link from "next/link"
import Navbar from "../components/navbar"

export default function Home() {
  return (
    <div>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to Our Bidding Platform</h1>
        <p className="mb-4">Explore our current auctions or list a new item.</p>
        <div className="space-x-4">
          <Link href="/items" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View All Items
          </Link>
          <Link
            href="/admin/submit-item"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            List New Item
          </Link>
        </div>
      </main>
    </div>
  )
}

