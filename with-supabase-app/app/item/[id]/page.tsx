"use client";
import React, { useState, useEffect } from "react";
import CountdownTimer from "@/app/components/CountdownTimer";
import BiddingForm from "@/app/components/BiddingForm";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import Image from 'next/image';


export default function ItemPage() {
  const [item, setItem] = useState<any>(null); // Store a single item
  const [auctionEnded, setAuctionEnded] = useState(false);
  const id = useParams().id;
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);



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

  useEffect(()=> {
    const fetchBids = async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_item_id', id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBids(data);
      } else {
        console.error('Error fetching bids:', error, data);
      }
    }
    fetchBids();
  }
  ,[item]);



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
        <Image src={item.image} alt="NBC Logo" width={600} height={500} />



        </div>

        <div>
          {item.owner == user && (
            <h1 className="text-3xl mb-4">This is YOUR Auction!</h1>
          )}
          <h1 className="text-3xl mb-4">{item.title}</h1>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="text-xl font-semibold mb-1">
            Current Bid: ${item.current_bid}
          </div>
          {item.starting_bid ? <div className="text-l text-gray-600 font-semibold">{ "Starting bid: " + item.starting_bid }</div> : ""}
          {item.min_increase ? <div className="text-l text-gray-600 font-semibold mb-2">{ "Minimum Increase: " + item.min_increase }</div> : ""}
          <div className="text-xl font-semibold mb-4">
            {item.bidder == user ? "You are leading!" : ""}
          </div>
          {!auctionEnded ? (
            <>
              <div className="mb-4">
                <CountdownTimer targetDate={new Date(item.countdown)} />
              </div>
              <BiddingForm
                currentBid={item.current_bid}
                minIncrement={5}
                onPlaceBid={onPlaceBid}
              />
            </>
          ) : (
            <div className="text-2xl font-bold text-green-600">
              Auction Ended
            </div>
          )}

          {/* Display the list of bids (JSON) for debugging or record keeping */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">All Bids</h2>
            {bids.length > 0 ? (
              <ul className="space-y-2">
                {bids.map((bid) => (
                  <li key={bid.id} className="border p-2 rounded">
                    <p>Bid Amount: ${bid.amount}</p>
                    <p>Bidder: {bid.bidder_id}</p>
                    <p>Time: {bid.created_at}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bids yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
