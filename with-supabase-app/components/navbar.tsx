'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    return (
        <nav className={`top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md p-10`}>
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Bidding Platform
            </Link>
            <div className="space-x-4">
              <Link href="/items" className="hover:text-gray-300">
                View Items
              </Link>
              <Link href="/admin/submit-item" className="hover:text-gray-300">
                List Item
              </Link>
              <Link href="/sign-in" className="hover:text-gray-300">
                Sign In
              </Link>
                <div className="relative group inline-block">
                <Link href="#" className="hover:text-gray-300">
                  Balance
                </Link>
                <div className="absolute hidden group-hover:block bg-white text-black p-2 mt-1 rounded shadow-lg">
                  <p>Your balance: $1000</p> {/* Placeholder variable */}
                  <br /> {/*Line break */}
                  <p>Frozen funds: $1000</p> {/* Placeholder variable 2*/}
                </div>
                </div>
              </div>
            </div>
        </nav>
    );
}