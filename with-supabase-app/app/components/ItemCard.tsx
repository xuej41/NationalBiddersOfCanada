import Image from "next/image"
import Link from "next/link"
import CountdownTimer from "./CountdownTimer"

interface ItemCardProps {
  id: string
  title: string
  description: string
  currentBid: number
  endTime: Date
  imageUrl?: string
}

export default function ItemCard({ id, title, description, currentBid, endTime, imageUrl }: ItemCardProps) {
  const isExpired = new Date() > endTime;
  console.log("ItemCard", id, title, description, currentBid, endTime, imageUrl)

  return (
    <Link href={`/item/${id}`}>
        <div className={`border-2 rounded-lg overflow-hidden shadow-lg hover:border-2 hover:border-gray-400 hover:bg-gray-100 transition-colors duration-300 ${isExpired ? `bg-gray-300 hover:bg-gray-200` : ``}`}>
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
            <CountdownTimer targetDate={new Date(endTime)} />
            </div>
            <Link
            href={`/item/${id}`}
            className={`focus:ring-2 focus:ring-red-500 focus:ring-offset-1 mt-4 block text-center  text-white py-2 rounded-full transition-colors duration-300 ${isExpired ?`bg-gray-500 hover:bg-gray-800` : `bg-red-500 hover:bg-red-700`}`}>
            View Details
            </Link>
        </div>
        </div>
    </Link>
  )
}

