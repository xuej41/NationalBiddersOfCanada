"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import CountdownTimer from "@/app/components/CountdownTimer"
import BiddingForm from "@/app/components/BiddingForm"

// This data would typically come from your backend based on the item ID
const getItemData = (id: string) => ({
    id,
    title: "Vintage Watch",
    description: "A beautiful vintage watch from the 1950s",
    currentBid: 100,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    imageUrl: "/placeholder.svg",
  });

export default function ItemPage(params : {id : string} ) {
  const [item, setItem] = useState(getItemData(params.id))
  const [auctionEnded, setAuctionEnded] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch the item data from your API here
    setItem(getItemData(params.id))
  }, [params.id])

  const handlePlaceBid = (amount: number) => {
    //sign in prompt
    //const username = ""; Replace with actual logic to get the username
    // if (!username) {
    //     alert("You must be signed in to place a bid.");
    //     return;
    //   }
    // Here you would typically send the bid to your backend
    console.log(`Placing bid of $${amount} on item ${params.id}`)
    setItem((prevItem) => ({ ...prevItem, currentBid: amount }))
  }

  const handleAuctionEnd = () => {
    setAuctionEnded(true)
    //update winner in backend
    console.log("Auction ended")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            width={600}
            height={400}
            className="w-full object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="text-xl font-semibold mb-4">Current Bid: ${item.currentBid}</div>
          {!auctionEnded ? (
            <>
              <div className="mb-4">
                <CountdownTimer endTime={item.endTime} onEnd={handleAuctionEnd} />
              </div>
              <BiddingForm currentBid={item.currentBid} minIncrement={5} onPlaceBid={handlePlaceBid} />
            </>
          ) : (
            <div className="text-2xl font-bold text-green-600">Auction Ended</div>
          )}
        </div>
      </div>
    </div>
  )
}