-- Add is_premium column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Update existing rows (if any) to false
UPDATE products SET is_premium = FALSE WHERE is_premium IS NULL;
