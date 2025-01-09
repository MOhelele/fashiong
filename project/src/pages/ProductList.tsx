import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

function ProductList() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error); Continuing the ProductList.tsx file content:

```
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryTitle = category?.charAt(0).toUpperCase() + category?.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{categoryTitle}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-80 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or check back later for new products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductList;