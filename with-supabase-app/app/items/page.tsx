import ItemCard from "../components/ItemCard"

// This data would typically come from your backend
const items = [
  {
    id: "1",
    title: "Vintage Watch",
    description: "A beautiful vintage watch from the 1950s",
    currentBid: 100,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Antique Vase",
    description: "An exquisite antique vase from the Ming Dynasty",
    currentBid: 500,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Rare Coin Collection",
    description: "A set of rare coins from various historical periods",
    currentBid: 250,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    imageUrl: "/placeholder.svg",
  },
]

export default function ItemsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Current Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  )
}

