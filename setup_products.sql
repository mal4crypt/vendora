-- Create Products Table if not exists
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL, -- references categories.id
  image_url TEXT,
  location TEXT,
  seller_id UUID REFERENCES auth.users NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read products
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

-- Policy: Sellers can insert their own products
DROP POLICY IF EXISTS "Sellers can insert own products" ON products;
CREATE POLICY "Sellers can insert own products" 
ON products FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

-- Policy: Sellers can update their own products
DROP POLICY IF EXISTS "Sellers can update own products" ON products;
CREATE POLICY "Sellers can update own products" 
ON products FOR UPDATE 
USING (auth.uid() = seller_id);

-- Policy: Sellers can delete their own products
DROP POLICY IF EXISTS "Sellers can delete own products" ON products;
CREATE POLICY "Sellers can delete own products" 
ON products FOR DELETE 
USING (auth.uid() = seller_id);
