
import React from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#121212',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '24px' }}>Admin Dashboard</h1>
      <p style={{ marginBottom: '24px' }}>Welcome to the admin dashboard. Here you can manage clients and their diet plans.</p>
      
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '16px' }}>
            <Link href="/admin/clients" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Manage Clients
            </Link>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Link href="/admin/dishes" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Manage Dishes
            </Link>
          </li>
          <li style={{ marginBottom: '16px' }}>
            <Link href="/admin/menus" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Manage Menus
            </Link>
          </li>
          {/* Add more links here */}
        </ul>
      </nav>
    </div>
  );
};

export default DashboardPage;
