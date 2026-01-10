-- Create Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id TEXT NOT NULL, -- Refers to your product IDs (which seem to be text/string based currently)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- RLS for Wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist" 
ON wishlist FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own wishlist" 
ON wishlist FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist" 
ON wishlist FOR DELETE 
USING (auth.uid() = user_id);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- We can generate custom order IDs like 'ORD-123'
  user_id UUID REFERENCES auth.users NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending', -- Pending, Shipped, Delivered
  items JSONB DEFAULT '[]'::jsonb, -- Store snapshot of items
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS for Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Allow inserting orders (e.g. from checkout)
CREATE POLICY "Users can create orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);
