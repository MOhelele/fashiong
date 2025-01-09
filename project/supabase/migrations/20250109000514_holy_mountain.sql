/*
  # Initial Schema for Fashion E-commerce Platform

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text) - enum: 'parfums', 'skincare', 'makeup', 'others'
      - `image_url` (text)
      - `stock` (int)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `phone` (text)
      - `address` (text)
      - `status` (text) - enum: 'pending', 'shipped', 'delivered'
      - `total_amount` (numeric)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (int)
      - `price_at_time` (numeric)

  2. Security
    - Enable RLS on all tables
    - Admin can perform all operations
    - Public users can read products and create orders
*/

-- Create enum types
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered');
CREATE TYPE product_category AS ENUM ('parfums', 'skincare', 'makeup', 'others');

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category product_category NOT NULL,
  image_url text,
  stock int NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  price_at_time numeric NOT NULL CHECK (price_at_time >= 0)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can modify products"
  ON products
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'mely'));

-- Policies for orders
CREATE POLICY "Public can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON orders
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'mely'));

CREATE POLICY "Admin can update orders"
  ON orders
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'mely'));

-- Policies for order items
CREATE POLICY "Public can create order items"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can view all order items"
  ON order_items
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'mely'));