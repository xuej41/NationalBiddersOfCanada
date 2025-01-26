'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/nbclogo.png'
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
      <nav className={`top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md py-2 hover:py-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="NBC Logo" width={150} height={150} />
              <div className='flex flex-col'>
              </div>
            </div>
          </Link>
          <div className="space-x-4">
            <Link href="/items" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
              View Items
            </Link>
            <Link href="/admin/submit-item" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
              List Item
            </Link>
            <Link href="/sign-in" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
              Sign In
            </Link>
            <div className="relative group inline-block">
              <Link href="#" className="rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-8 text-gray-500 hover:underline underline-offset-4">
                Balance
              </Link>
              <div className="absolute hidden group-hover:block hover: bg-white text-gray-500 p-2 mt-1 rounded shadow-lg">
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