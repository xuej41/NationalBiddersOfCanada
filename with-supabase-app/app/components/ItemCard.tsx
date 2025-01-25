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
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        width={300}
        height={200}
        className="w-full object-cover h-48"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Current Bid: ${currentBid}</span>
          {/* <CountdownTimer endTime={endTime} onEnd={() => console.log("Auction ended")} /> */}
        </div>
        <Link
          href={`/item/${id}`}
          className="mt-4 block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

