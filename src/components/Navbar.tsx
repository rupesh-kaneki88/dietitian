
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hide navbar for client pages
  if (pathname.startsWith('/client')) {
    return null;
  }

  const handleLogout = async () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/admin/login');
  };

  return (
    <nav className="bg-[#1e1e1e] p-4 shadow-md flex justify-between items-center fixed w-full z-50">
      <div className="flex items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Dietitian Bitch :/
        </Link>
        <div className="hidden md:flex ml-8">
          <Link href="/" className="text-white text-lg mr-4 hover:text-blue-400 transition-colors duration-300">
            Dashboard
          </Link>
          <Link href="/admin/clients" className="text-white text-lg mr-4 hover:text-blue-400 transition-colors duration-300">
            Clients
          </Link>
          <Link href="/admin/dishes" className="text-white text-lg mr-4 hover:text-blue-400 transition-colors duration-300">
            Dishes
          </Link>
          <Link href="/admin/menus" className="text-white text-lg hover:text-blue-400 transition-colors duration-300">
            Menus
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 hidden md:block"
        >
          Logout
        </button>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#1e1e1e] shadow-md flex flex-col items-center py-4 space-y-4">
          <Link href="/" className="text-white text-lg hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/admin/clients" className="text-white text-lg hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
            Clients
          </Link>
          <Link href="/admin/dishes" className="text-white text-lg hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
            Dishes
          </Link>
          <Link href="/admin/menus" className="text-white text-lg hover:text-blue-400 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
            Menus
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 w-3/4"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
