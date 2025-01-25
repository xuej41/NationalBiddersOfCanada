"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BiddingFormProps {
  currentBid: number
  minIncrement: number
  onPlaceBid: (amount: number) => void
}

export default function BiddingForm({ currentBid, minIncrement, onPlaceBid }: BiddingFormProps) {
  const [bidAmount, setBidAmount] = useState(currentBid + minIncrement)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPlaceBid(bidAmount)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(Math.max(currentBid + minIncrement, Number.parseFloat(e.target.value)))}
          min={currentBid + minIncrement}
          step={minIncrement}
          className="w-full"
        />
        <Button type="submit">Place Bid</Button>
      </div>
    </form>
  )
}

