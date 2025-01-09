import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Package, ShoppingBag, Bell, DollarSign, LogOut, Plus, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  status: 'pending' | 'shipped' | 'delivered';
  total_amount: number;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

interface SalesData {
  date: string;
  amount: number;
}

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'parfums',
    image_url: '',
    stock: 0
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch products');
      return;
    }
    setProducts(data || []);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('products')
      .insert([newProduct]);

    if (error) {
      toast.error('Failed to add product');
      return;
    }

    toast.success('Product added successfully');
    setShowForm(false);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      category: 'parfums',
      image_url: '',
      stock: 0
    });
    fetchProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete product');
      return;
    }

    toast.success('Product deleted successfully');
    fetchProducts();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="parfums">Parfums</option>
                <option value="skincare">Skin Care</option>
                <option value="makeup">Make Up</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                required
                min="0"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Product
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Stock: {product.stock} | Category: {product.category}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'pending' | 'shipped' | 'delivered'>('pending');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', filter)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch orders');
      return;
    }
    setOrders(data || []);
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'shipped' | 'delivered') => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Failed to update order status');
      return;
    }

    toast.success(`Order marked as ${newStatus}`);
    fetchOrders();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'shipped'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{order.customer_name}</h3>
                <p className="text-gray-600">{order.phone}</p>
                <p className="text-gray-600">{order.address}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Ordered on: {format(new Date(order.created_at), 'PPpp')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600">
                  ${order.total_amount.toFixed(2)}
                </p>
                {filter === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Mark as Shipped
                  </button>
                )}
                {filter === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceCenter() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [timeRange, setTimeRange] = useState<'3' | '6' | '12'>('3');

  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  const fetchSalesData = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .gte('created_at', new Date(Date.now() - parseInt(timeRange) * 30 * 24 * 60 * 60 * 1000).toISOString())
      .eq('status', 'delivered');

    if (error) {
      toast.error('Failed to fetch sales data');
      return;
    }

    const aggregatedData = data.reduce((acc: { [key: string]: number }, order) => {
      const date = format(new Date(order.created_at), 'MMM d');
      acc[date] = (acc[date] || 0) + order.total_amount;
      return acc;
    }, {});

    const formattedData = Object.entries(aggregatedData).map(([date, amount]) => ({
      date,
      amount
    }));

    setSalesData(formattedData);
  };

  const totalSales = salesData.reduce((sum, data) => sum + data.amount, 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Finance Center</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeRange('3')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === '3'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimeRange('6')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === '6'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeRange('12')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === '12'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            12 Months
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Total Sales</h3>
        <p className="text-3xl font-bold text-indigo-600">${totalSales.toFixed(2)}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6" style={{ height: '400px' }}>
        <h3 className="text-xl font-semibold mb-4">Sales Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('status', 'pending');

    if (!error && data) {
      setPendingOrdersCount(data.length);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Package className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Mely Admin</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Orders
                  {pendingOrdersCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                      {pendingOrdersCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/finance"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Finance
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="finance" element={<FinanceCenter />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;