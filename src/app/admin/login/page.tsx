
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        console.log('Login successful, redirecting to /');
        router.push('/');
      } else {
        console.log('Login failed:', data.message);
        setError(data.message);
      }
    } catch (error) {
      console.log('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#121212',
      color: 'white'
    }}>
      <div ref={formRef} style={{
        padding: '40px',
        borderRadius: '8px',
        backgroundColor: '#1e1e1e',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '2rem' }}>Admin Login</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#2c2c2c',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '12px',
              marginBottom: '24px',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#2c2c2c',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
          <button
            type="submit"
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#0070f3',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
