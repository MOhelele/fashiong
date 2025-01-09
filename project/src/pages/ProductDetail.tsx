import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderForm.customerName,
          phone: orderForm.phone,
          address: orderForm.address,
          total_amount: product.price * quantity,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemError } = await supabase
        .from('order_items')
        .insert([{
          order_id: orderData.id,
          product_id: product.id,
          quantity: quantity,
          price_at_time: product.price
        }]);

      if (itemError) throw itemError;

      toast.success('Order placed successfully!');
      setShowOrderForm(false);
      navigate(-1);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80'}
                alt={product.name}
                className="h-96 w-full object-cover md:h-full"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
              <p className="text-gray-600 mb-8">{product.description}</p>
              
              <div className="mb-8">
                <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
                <span className="ml-2 text-sm text-gray-500">In Stock: {product.stock}</span>
              </div>

              <div className="flex items-center mb-8">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="mx-4 text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <span className="text-lg font-semibold">Total: ${(product.price * quantity).toFixed(2)}</span>
              </div>

              {!showOrderForm ? (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Order Now
                </button>
              ) : (
                <form onSubmit={handleOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      required
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Place Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;