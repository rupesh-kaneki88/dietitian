'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import LoadingSpinner from '@/components/LoadingSpinner';

interface IClient {
  _id: string;
  name: string;
  email: string;
}

interface IDish {
  _id: string;
  name: string;
  recipe: string;
}

interface IMenu {
  _id: string;
  client: IClient;
  dishes: IDish[];
}

const MenusPage = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState<IMenu | null>(null);

  const formRef = useRef(null);
  const tableRef = useRef(null);

  const fetchData = async () => {
    try {
      const [menusRes, clientsRes, dishesRes] = await Promise.all([
        fetch('/api/menus'),
        fetch('/api/clients'),
        fetch('/api/dishes'),
      ]);

      const [menusData, clientsData, dishesData] = await Promise.all([
        menusRes.json(),
        clientsRes.json(),
        dishesRes.json(),
      ]);

      if (menusData.success) setMenus(menusData.data);
      if (clientsData.success) setClients(clientsData.data);
      if (dishesData.success) setDishes(dishesData.data);

    } catch (error) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(tableRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    fetchData();
  }, []);


  const handleDishChange = (dishId: string) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedClient || selectedDishes.length === 0) {
      setError('Please select a client and at least one dish.');
      return;
    }

    const method = editingMenu ? 'PUT' : 'POST';
    const url = editingMenu ? `/api/menus/${editingMenu._id}` : '/api/menus';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client: selectedClient, dishes: selectedDishes }),
      });

      const data = await res.json();

      if (res.ok) {
        if (editingMenu) {
          setMenus(menus.map(menu => menu._id === data.data._id ? data.data : menu));
          setEditingMenu(null);
        } else {
          setMenus([...menus, data.data]);
        }
        alert(`Menu ${editingMenu ? 'updated' : 'added'} successfully!`);
        fetchData();
        setSelectedClient('');
        setSelectedDishes([]);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleEdit = (menu: IMenu) => {
    setEditingMenu(menu);
    setSelectedClient(menu.client._id);
    setSelectedDishes(menu.dishes.map(dish => dish._id));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      const res = await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Menu deleted successfully!');
        setMenus(menus.filter(menu => menu._id !== id));
      } else {
        const data = await res.json();
        alert(`Error ${data.message}`);
        setError(data.message);
      }
    } catch (error) {
      alert('An error occurred during deletion.');
      setError('An error occurred during deletion.');
    }
  };

  const handleCancelEdit = () => {
    setEditingMenu(null);
    setSelectedClient('');
    setSelectedDishes([]);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: '40px', paddingTop: '80px', color: 'white', backgroundColor: '#121212', minHeight: 'calc(100vh - 80px)' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '2.5rem', fontWeight: 'bold' }}>Manage Menus</h1>

      <div ref={formRef} style={{ marginBottom: '40px', padding: '20px', borderRadius: '8px', backgroundColor: '#1e1e1e', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>{editingMenu ? 'Edit Menu' : 'Create New Menu'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white', fontSize: '1rem' }}
          >
            <option value="">Select a Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>

          <div style={{ marginBottom: '16px', padding: '15px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2c2c2c' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Select Dishes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
            {dishes.map((dish) => (
              <div key={dish._id} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={dish._id}
                  checked={selectedDishes.includes(dish._id)}
                  onChange={() => handleDishChange(dish._id)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={dish._id} style={{ fontSize: '1rem' }}>{dish.name}</label>
              </div>
            ))}
            </div>
          </div>

          <button type="submit" style={{ padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>
            {editingMenu ? 'Update Menu' : 'Create Menu'}
          </button>
          {editingMenu && (
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
        <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>All Menus</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Client</th>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Dishes</th>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu._id} className="hover:bg-gray-700 transition-colors duration-300">
                <td style={{ border: '1px solid #333', padding: '12px' }}>{menu.client.name}</td>
                <td style={{ border: '1px solid #333', padding: '12px' }}>
                  {menu.dishes.map((dish) => dish.name).join(', ')}
                </td>
                <td style={{ border: '1px solid #333', padding: '12px' }}>
                  <button
                    onClick={() => handleEdit(menu)}
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
                    onClick={() => handleDelete(menu._id)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenusPage;

