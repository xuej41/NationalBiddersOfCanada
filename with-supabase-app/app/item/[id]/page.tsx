"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import CountdownTimer from "@/app/components/CountdownTimer"
import BiddingForm from "@/app/components/BiddingForm"
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation"



// This data would typically come from your backend based on the item ID
// const getItemData = (id: string) => ({
//     id,
//     title: "Vintage Watch",
//     description: "A beautiful vintage watch from the 1950s",
//     currentBid: 100,
//     endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
//     imageUrl: "/images/placeholder.jpg",
//   });
export default function ItemPage() {
  const [item, setItem] = useState<any>(null); // Store a single item
  const [auctionEnded, setAuctionEnded] = useState(false);
  const id = useParams().id;
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);



  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUser(data.user.id);
      }
      else{
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
    console.log(user);
  }
  ,[user]);



  useEffect(() => {


    // Fetch the specific item
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('auction_items')
        .select('*')
        .eq('id', id) // Fetch only the item with matching ID
        .single(); // Ensure we get a single item instead of an array

      if (!error && data) {
        setItem(data);
      } else {
        console.error('Error fetching item:', error, data);
      }
    };

    fetchItem();


    // Subscribe to real-time changes for the specific item
    const channel = supabase
      .channel('my-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes
          schema: 'public',
          table: 'auction_items',
        },
        (payload) => {
          console.log('Change received!', payload);

          if (payload.new === id) {
            if (payload.eventType === 'UPDATE') {
              setItem(payload.new);
            } else if (payload.eventType === 'DELETE') {
              setItem(null); // Clear the item if it is deleted
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [item]);

  const onPlaceBid = async (newBid: number) => {
    if (!id || !item) return ;

    try {
      const response = await fetch("http://localhost:3000/api/bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auction_item_id: id,
          amount: newBid,
        }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItem(updatedItem); // Update the item with the latest data
        console.log("Bid placed successfully:", updatedItem);
      } else {
        console.error("Failed to place bid:", response.statusText, await response.json());
      }
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };


  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* <Image
            src={item.imageUrl || "/images/placeholder.jpg"}
            alt={item.title}
            width={600}
            height={400}
            className="w-full object-cover rounded-lg"
          /> */}
        </div>
        <div>
          {item.owner == user ? <h1 className="text-3xl mb-4">This is YOUR Auction!</h1> : ""}
          <h1 className="text-3xl mb-4">{item.title}</h1>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="text-xl font-semibold mb-4">Current Bid: ${item.current_bid} </div>
          <div className="text-xl font-semibold mb-4" >{item.bidder == user ? " You are leading!" : ""}</div>
          {!auctionEnded ? (
            <>
              <div className="mb-4">
                <CountdownTimer targetDate={ new Date(item.countdown)}  />
              </div>
              <BiddingForm currentBid={item.current_bid} minIncrement={5} onPlaceBid={onPlaceBid} />
            </>
          ) : (
            <div className="text-2xl font-bold text-green-600">Auction Ended</div>
          )}
        </div>
      </div>
    </div>
  )
}