'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import LoadingSpinner from '@/components/LoadingSpinner';

interface IClient {
  _id: string;
  name: string;
  email: string;
}

const ClientsPage = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<IClient | null>(null);

  const formRef = useRef(null);
  const tableRef = useRef(null);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
      } else {
        setError('Failed to fetch clients');
      }
    } catch (error) {
      setError('An error occurred while fetching clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(tableRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const method = editingClient ? 'PUT' : 'POST';
    const url = editingClient ? `/api/clients/${editingClient._id}` : '/api/clients';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Client ${editingClient ? 'updated' : 'added'} successfully!`);
        fetchClients(); // Re-fetch clients to update the list
        setName('');
        setEmail('');
        setEditingClient(null);
      } else {
        alert(`Error: ${data.message}`);
        setError(data.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      setError('An error occurred. Please try again.');
    }
  };

  const handleEdit = (client: IClient) => {
    setEditingClient(client);
    setName(client.name);
    setEmail(client.email);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Client deleted successfully!');
        fetchClients(); // Re-fetch clients to update the list
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
        setError(data.message);
      }
    } catch (error) {
      alert('An error occurred during deletion.');
      setError('An error occurred during deletion.');
    }
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: '40px', paddingTop: '80px', color: 'white', backgroundColor: '#121212', minHeight: 'calc(100vh - 80px)' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '2.5rem', fontWeight: 'bold' }}>Manage Clients</h1>

      <div ref={formRef} style={{ marginBottom: '40px', padding: '20px', borderRadius: '8px', backgroundColor: '#1e1e1e', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white', fontSize: '1rem' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white', fontSize: '1rem' }}
          />
          <button type="submit" style={{ padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>
            {editingClient ? 'Update Client' : 'Add Client'}
          </button>
          {editingClient && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#6c757d',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
                marginTop: '10px'
              }}
            >
              Cancel Edit
            </button>
          )}
          {error && <p style={{ color: 'red', marginTop: '16px' }}>{error}</p>}
        </form>
      </div>

      <div ref={tableRef}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>All Clients</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Name</th>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Email</th>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>ID</th>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-700 transition-colors duration-300">
                <td style={{ border: '1px solid #333', padding: '12px' }}>{client.name}</td>
                <td style={{ border: '1px solid #333', padding: '12px' }}>{client.email}</td>
                <td style={{ border: '1px solid #333', padding: '12px', fontSize: '0.8rem' }}>{client._id}</td>
                <td style={{ border: '1px solid #333', padding: '12px' }}>
                  <button
                    onClick={() => handleEdit(client)}
                    style={{
                      backgroundColor: '#ffc107',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.3s ease',
                      marginRight: '5px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.3s ease',
                      marginRight: '5px'
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleCopyLink(client._id)}
                    style={{
                      backgroundColor: '#0070f3',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    Copy Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;

const handleCopyLink = (clientId: string) => {
  const link = `${window.location.origin}/client/${clientId}`;
  navigator.clipboard.writeText(link).then(() => {
    alert('Client link copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy link:', err);
    alert('Failed to copy link.');
  });
};
