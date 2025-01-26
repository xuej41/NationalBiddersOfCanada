'use client';
import { createClient } from "@/utils/supabase/client";
import ItemCard from "../app/components/ItemCard";
import { useEffect, useState } from "react";

export default function AuctionItems() {
    const [items, setItems] = useState<any[]>([]);

    const supabase = createClient();
    useEffect(() => {
      // 1. Fetch initial data (optional)
      const fetchInitialData = async () => {
        const { data, error } = await supabase
          .from('auction_items')
          .select('*');
  
        if (!error && data) {
          setItems(data);
        }
      };
      fetchInitialData();
  
      // 2. Subscribe to real-time changes
      const channel = supabase.channel('my-channel')
        .on(
          'postgres_changes',
          {
            event: '*', // or 'INSERT' | 'UPDATE' | 'DELETE'
            schema: 'public',
            table: 'auction_items',
          },
          (payload) => {
            console.log('Change received!', payload);
  
            // Decide how to update your local state:
            if (payload.eventType === 'INSERT') {
              setItems((prev) => [...prev, payload.new]);
            } else if (payload.eventType === 'UPDATE') {
              setItems((prev) =>
                prev.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setItems((prev) =>
                prev.filter((item) => item.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
  
      // 3. Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }, [items]);
  
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items ? items.map((item) => (
                <ItemCard 
                  key={item.id} 
                  id={item.id} 
                  title={item.title} 
                  description={item.description} 
                  currentBid={item.current_bid} 
                  endTime={new Date(item.countdown)}
                  imageUrl={item.image} 
                /> // key, id, title, description, currentBid, endTime, imageUrl
            )) : ""}
        </div>
    );
}