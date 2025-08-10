'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import LoadingSpinner from '@/components/LoadingSpinner';

interface IDish {
  _id: string;
  name: string;
  recipe: string;
}

const DishesPage = () => {
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingDish, setEditingDish] = useState<IDish | null>(null);

  const formRef = useRef(null);
  const tableRef = useRef(null);

  const fetchDishes = async () => {
    try {
      const res = await fetch('/api/dishes');
      const data = await res.json();
      if (data.success) {
        setDishes(data.data);
      } else {
        setError('Failed to fetch dishes');
      }
    } catch (error) {
      setError('An error occurred while fetching dishes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(tableRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    fetchDishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const method = editingDish ? 'PUT' : 'POST';
    const url = editingDish ? `/api/dishes/${editingDish._id}` : '/api/dishes';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, recipe }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Dish ${editingDish ? 'updated' : 'added'} successfully!`);
        fetchDishes(); // Re-fetch dishes to update the list
        setName('');
        setRecipe('');
        setEditingDish(null);
      } else {
        alert(`Error: ${data.message}`);
        setError(data.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      setError('An error occurred. Please try again.');
    }
  };

  const handleEdit = (dish: IDish) => {
    setEditingDish(dish);
    setName(dish.name);
    setRecipe(dish.recipe);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;

    try {
      const res = await fetch(`/api/dishes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Dish deleted successfully!');
        fetchDishes(); // Re-fetch dishes to update the list
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
    setEditingDish(null);
    setName('');
    setRecipe('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: '40px', paddingTop: '80px', color: 'white', backgroundColor: '#121212', minHeight: 'calc(100vh - 80px)' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '2.5rem', fontWeight: 'bold' }}>Manage Dishes</h1>

      <div ref={formRef} style={{ marginBottom: '40px', padding: '20px', borderRadius: '8px', backgroundColor: '#1e1e1e', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>{editingDish ? 'Edit Dish' : 'Add New Dish'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white', fontSize: '1rem' }}
          />
          <textarea
            placeholder="Recipe"
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)}
            style={{ padding: '12px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white', minHeight: '100px' }}
          />
          <button type="submit" style={{ padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}>
            {editingDish ? 'Update Dish' : 'Add Dish'}
          </button>
          {editingDish && (
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
        <h2 style={{ marginBottom: '16px', fontSize: '1.8rem' }}>All Dishes</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Name</th>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Recipe</th>
              <th style={{ border: '1px solid #333', padding: '12px', textAlign: 'left', backgroundColor: '#2c2c2c' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish._id} className="hover:bg-gray-700 transition-colors duration-300">
                <td style={{ border: '1px solid #333', padding: '12px' }}>{dish.name}</td>
                <td style={{ border: '1px solid #333', padding: '12px' }}>{dish.recipe}</td>
                <td style={{ border: '1px solid #333', padding: '12px' }}>
                  <button
                    onClick={() => handleEdit(dish)}
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
                    onClick={() => handleDelete(dish._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.3s ease'
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

export default DishesPage;
