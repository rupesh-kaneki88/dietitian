'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import gsap from 'gsap';

interface IDish {
  _id: string;
  name: string;
  recipe: string;
}

interface IMenu {
  _id: string;
  client: {
    _id: string;
    name: string;
  };
  dishes: IDish[];
}

const ClientMenuPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [menu, setMenu] = useState<IMenu | null>(null);
  const [selectedDish, setSelectedDish] = useState<IDish | null>(null);
  const [error, setError] = useState('');

  const menuRef = useRef(null);
  const dishDetailRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(menuRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    if (selectedDish) {
      gsap.fromTo(dishDetailRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" });
    }
  }, [selectedDish]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`/api/menus?client=${id}`);
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          setMenu(data.data[0]);
        } else {
          setError('Failed to fetch menu');
        }
      } catch (error) {
        setError('An error occurred while fetching the menu');
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id]);

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  if (!menu) {
    return <div className="p-10 text-xl text-white">Loading, please wait...</div>;
  }

  return (
    <div className="p-10 pt-20 text-white bg-[#121212] min-h-screen">
      <h1 className="mb-6 text-4xl font-bold text-center md:text-left">{menu.client.name}'s Menu</h1>

      <div ref={menuRef} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
          <h2 className="mb-4 text-3xl font-semibold">Dishes</h2>
          <ul className="list-none p-0">
            {menu.dishes.map((dish) => (
              <li
                key={dish._id}
                onClick={() => setSelectedDish(dish)}
                className={`p-3 mb-2 rounded-md cursor-pointer text-lg transition-colors duration-300 ${selectedDish?._id === dish._id ? 'bg-blue-600' : 'bg-[#1e1e1e] hover:bg-blue-600'}`}>
                {dish.name}
              </li>
            ))}
          </ul>
        </div>

        <div ref={dishDetailRef} className="md:col-span-2">
          {selectedDish ? (
            <div className="p-6 rounded-lg bg-[#1e1e1e] shadow-lg">
              <h2 className="mb-4 text-3xl font-semibold">{selectedDish.name}</h2>
              <h3 className="mb-2 text-xl font-medium">Recipe</h3>
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{selectedDish.recipe}</p>
            </div>
          ) : (
            <div className="p-6 border border-dashed border-gray-700 rounded-lg bg-[#1e1e1e]">
              <p className="text-center text-lg">Select a dish to see the recipe.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientMenuPage;
