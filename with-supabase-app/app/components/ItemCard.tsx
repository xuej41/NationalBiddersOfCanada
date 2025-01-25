import Image from "next/image"
import Link from "next/link"
import CountdownTimer from "./CountdownTimer"

interface ItemCardProps {
  id: string
  title: string
  description: string
  currentBid: number
  endTime: Date
  imageUrl: string
}

export default function ItemCard({ id, title, description, currentBid, endTime, imageUrl }: ItemCardProps) {
  return (
    <Link href={`/item/${id}`}>
        <div className="border rounded-lg overflow-hidden shadow-lg hover:bg-gray-100 transition-colors duration-300 hover:border-gray-700">
        <Image
            src={imageUrl || "/placeholder.jpg"}
            alt={title}
            width={300}
            height={200}
            className="w-full object-cover h-48"
        />
        <div className="p-4">
            <h2 className="text-2xl mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex justify-between items-center">
            <span className="text-xl">Current Bid: ${currentBid}</span>
            {/* <CountdownTimer endTime={endTime} onEnd={() => console.log("Auction ended")} /> */}
            </div>
            <Link
            href={`/item/${id}`}
            className="mt-4 block text-center bg-red-500 text-white py-2 rounded-full transition-colors duration-300 hover:bg-red-700"
            >
            View Details
            </Link>
        </div>
        </div>
    </Link>
  )
}

