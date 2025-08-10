'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import LoadingSpinner from '@/components/LoadingSpinner';

const HomePage = () => {
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const navRef = useRef(null);
  const statsRef = useRef(null);

  const [stats, setStats] = useState({
    clientCount: 0,
    dishCount: 0,
    menuCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    gsap.fromTo(paragraphRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.fromTo(navRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    gsap.fromTo(statsRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" });
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{
      padding: '40px',
      paddingTop: '80px',
      backgroundColor: '#121212',
      color: 'white',
      minHeight: 'calc(100vh - 80px)', // Adjust for Navbar height
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 ref={titleRef} style={{ marginBottom: '24px', fontSize: '3rem', fontWeight: 'bold', textAlign: 'center' }}>Admin Dashboard</h1>
      <p ref={paragraphRef} style={{ marginBottom: '40px', fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>Welcome to the admin dashboard. Here you can manage clients and their diet plans.</p>
      
      <div ref={statsRef} style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{
          backgroundColor: '#1e1e1e',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          minWidth: '180px'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>{stats.clientCount}</h2>
          <p style={{ fontSize: '1.1rem' }}>Total Clients</p>
        </div>
        <div style={{
          backgroundColor: '#1e1e1e',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          minWidth: '180px'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>{stats.dishCount}</h2>
          <p style={{ fontSize: '1.1rem' }}>Total Dishes</p>
        </div>
        <div style={{
          backgroundColor: '#1e1e1e',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          minWidth: '180px'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>{stats.menuCount}</h2>
          <p style={{ fontSize: '1.1rem' }}>Total Menus</p>
        </div>
      </div>

      <nav ref={navRef}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <li style={{ marginBottom: '16px' }}>
            <Link href="/admin/clients" className="text-[#0070f3] text-decoration-none text-xl p-2 border-2 border-[#0070f3] rounded-lg transition-all duration-300 block text-center w-[250px] hover:bg-[#0070f3] hover:text-white">
              Manage Clients
            </Link>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Link href="/admin/dishes" className="text-[#0070f3] text-decoration-none text-xl p-2 border-2 border-[#0070f3] rounded-lg transition-all duration-300 block text-center w-[250px] hover:bg-[#0070f3] hover:text-white">
              Manage Dishes
            </Link>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Link href="/admin/menus" className="text-[#0070f3] text-decoration-none text-xl p-2 border-2 border-[#0070f3] rounded-lg transition-all duration-300 block text-center w-[250px] hover:bg-[#0070f3] hover:text-white">
              Manage Menus
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
