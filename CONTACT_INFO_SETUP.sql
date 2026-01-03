-- Create contact_info table
-- This table stores the WhatsApp number and email address for the contact page
-- Only one record should exist (singleton pattern)

CREATE TABLE IF NOT EXISTS contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: This table uses a singleton pattern where we always work with the first record
-- The application logic will handle ensuring only one record exists by:
-- 1. Checking if a record exists
-- 2. Updating if it exists, inserting if it doesn't

-- Enable Row Level Security (RLS)
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (anyone can view contact info)
CREATE POLICY "Allow public read access" ON contact_info
  FOR SELECT USING (true);

-- Create a policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON contact_info
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON contact_info
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON contact_info
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_contact_info_timestamp
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_info_updated_at();







