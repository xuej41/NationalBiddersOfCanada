'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/nbclogo.png'
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Profile {
  balance: number;
  locked_bal : number,
  id: string,
  user_id: string,
  created_at: string,
  username :string,

}


export default function Navbar() {
    const [profile, setProfile] = useState<any>(null);
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
    const supabase = createClient();
  useEffect(() => {


    // Fetch the specific item
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user) // Fetch only the item with matching ID
        .single(); // Ensure we get a single item instead of an array

      if (!error && data) {
        setProfile(data);
      } else {
        // console.error('Error fetching item:', error, data);
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
          // console.log('Change received!', payload);

          if (payload.new === user) {
            if (payload.eventType === 'UPDATE') {
              setProfile(payload.new);
            } else if (payload.eventType === 'DELETE') {
              setProfile(null); // Clear the item if it is deleted
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, user]);

    return (
      <nav className={`top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md py-2 hover:py-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/items" className="text-xl font-bold">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="NBC Logo" width={150} height={150} />
              <div className='flex flex-col'>
              </div>
            </div>
          </Link>
          <div className="space-x-6">
            <Link href="/items" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
              View Items
            </Link>
            <Link href="/admin/submit-item" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
              List Item
            </Link>
            {!user ?<Link href="/sign-in" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
              Sign In
            </Link> : <Link href="/sign-out" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">Sign Out</Link>}
            <div className="relative group inline-block">
              <Link href="#" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
                Balance
              </Link>
              <div className="absolute hidden group-hover:block hover: bg-white text-gray-500 p-2 mt-1 rounded shadow-lg">
                <p>Your balance: ${ profile && profile.balance ?profile.balance : 0}</p> {/* Placeholder variable */}
                <br /> {/*Line break */}
                <p>Frozen funds: ${profile && profile.locked_bal? profile.locked_bal : 0}</p> {/* Placeholder variable 2*/}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
}