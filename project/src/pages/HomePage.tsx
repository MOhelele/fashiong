import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Perfume, Sparkles, Palette, Package } from 'lucide-react';

const categories = [
  { id: 'parfums', name: 'Parfums', icon: Perfume, color: 'bg-pink-500' },
  { id: 'skincare', name: 'Skin Care', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'makeup', name: 'Make Up', icon: Palette, color: 'bg-rose-500' },
  { id: 'others', name: 'Others', icon: Package, color: 'bg-indigo-500' }
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Mely Fashion Store</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className="group relative overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105"
              >
                <div className={`${category.color} p-8 aspect-square flex flex-col items-center justify-center text-white`}>
                  <Icon size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default HomePage;