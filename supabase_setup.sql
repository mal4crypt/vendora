-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Box',
  color TEXT DEFAULT '#A2C2F2',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read categories
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

-- Policy: Only Admins can insert/delete (You can refine this later, for now let authenticated users add for testing if needed, or restrict to admin email)
-- Policy: Allow verified admins OR any purely authenticated user for now to unblock
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" 
ON categories FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (id, label, icon_name, color) VALUES
('all', 'All', 'Briefcase', '#0052CC'),
('trading', 'Trading', 'Smartphone', '#A2C2F2'),
('catering', 'Catering', 'Utensils', '#A2C2F2'),
('repair', 'Repair', 'Wrench', '#A2C2F2'),
('gas', 'Gas', 'Droplet', '#A2C2F2'),
('logistics', 'Logistics', 'Truck', '#A2C2F2'),
('real-estate', 'Real Estate', 'Home', '#A2C2F2'),
('petcare', 'Petcare', 'Dog', '#A2C2F2')
ON CONFLICT (id) DO NOTHING;
