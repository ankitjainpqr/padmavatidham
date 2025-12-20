# Supabase Setup Guide

This guide will help you set up Supabase for the admin panel and photo gallery.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: Your project name
   - Database Password: Choose a strong password
   - Region: Choose the closest region
5. Wait for the project to be created (takes a few minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## 3. Set Up Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values you copied in step 2.

**Important:** Never commit your `.env` file to git. It should already be in `.gitignore`.

## 4. Create the Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the following SQL to create the `photo_sections` table:

```sql
-- Create photo_sections table
CREATE TABLE photo_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  occasion TEXT,
  photos JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on date for faster queries
CREATE INDEX idx_photo_sections_date ON photo_sections(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE photo_sections ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (anyone can view photos)
CREATE POLICY "Allow public read access" ON photo_sections
  FOR SELECT USING (true);

-- Create a policy to allow authenticated users to insert
-- This requires users to be logged in to upload photos
CREATE POLICY "Allow authenticated insert" ON photo_sections
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Optional: Create a policy to allow authenticated users to update/delete
-- Uncomment if you want to add update/delete functionality later
-- CREATE POLICY "Allow authenticated update" ON photo_sections
--   FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated delete" ON photo_sections
--   FOR DELETE USING (auth.role() = 'authenticated');
```

3. Run the following SQL to create the `contact_info` table (for managing WhatsApp number and email on the Contact page):

```sql
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
```

**Note:** You can also find this SQL script in the `CONTACT_INFO_SETUP.sql` file in the project root.

## 5. Set Up Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Create a bucket named `photos` with the following settings:
   - **Name:** `photos`
   - **Public bucket:** ✅ Check this (so images can be accessed publicly)
   - **File size limit:** 10 MB (or your preferred limit)
   - **Allowed MIME types:** `image/*` (or specific types like `image/jpeg,image/png,image/gif`)

4. Set up Storage Policies:
   
   **Option A: Public Uploads (Development Only - Not Recommended)**
   - Go to **Storage** → **Policies** for the `photos` bucket
   - Click **New Policy**
   - Create a policy for public read access:
     - **Policy name:** `Public read access`
     - **Allowed operation:** SELECT
     - **Policy definition:** `true`
   - Create a policy for public upload:
     - **Policy name:** `Public upload access`
     - **Allowed operation:** INSERT
     - **Policy definition:** `true`
   
   **Option B: Authenticated Uploads Only (Recommended for Production & Localhost)**
   
   This is the secure option that works on both localhost and production:
   
   - Go to **Storage** → **Policies** for the `photos` bucket
   - Click **New Policy**
   - Create a policy for public read access (so anyone can view photos):
     - **Policy name:** `Public read access`
     - **Allowed operation:** SELECT
     - **Policy definition:** `true`
   - Create a policy for authenticated uploads only:
     - **Policy name:** `Authenticated upload access`
     - **Allowed operation:** INSERT
     - **Policy definition:** `auth.role() = 'authenticated'`
     - This ensures only logged-in users can upload photos
   
   **Important:** Since your admin panel already requires authentication (via the login page), this policy will work seamlessly. Users must be logged in to access the admin panel, so they'll automatically be authenticated when uploading.

## 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:8080/admin` (or your dev server URL)

3. Try uploading a photo:
   - Select a date
   - Optionally add an occasion
   - Upload one or more photos
   - Click "Upload Photos"

4. Check the Photos page at `http://localhost:8080/photos` to see if the uploaded photos appear

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure your `.env` file exists in the project root
- Verify that the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/updating the `.env` file

### Error: "relation 'photo_sections' does not exist"
- Make sure you've run the SQL script to create the table (step 4)

### Error: "new row violates row-level security policy"
- Check that you've created the RLS policies as shown in step 4

### Photos not uploading to storage
- Verify that the `photos` bucket exists and is public
- Check that the storage policies allow INSERT operations
- Check the browser console for detailed error messages

### Photos not displaying
- Verify that the storage bucket is set to public
- Check that the storage policies allow SELECT operations
- Verify that the image URLs in the database are correct

## 7. Set Up Authentication

The admin panel requires authentication. Here's how to set it up:

1. In your Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter an email and password for your admin account
4. Click **Create user**

Alternatively, you can enable email signup:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed
4. Users can then sign up at `/login` (though you may want to restrict signups in production)

### Creating Admin Users via SQL (Optional)

You can also create users via SQL in the SQL Editor:

```sql
-- This will create a user, but you'll need to set the password via the dashboard
-- or use Supabase Auth API
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('admin@example.com', crypt('your_password', gen_salt('bf')), NOW(), NOW(), NOW());
```

**Note:** The above SQL method is complex. It's easier to create users through the dashboard.

### Update Storage Policies for Authenticated Users (If You Started with Public Uploads)

If you initially set up public uploads and want to switch to authenticated-only uploads:

1. Go to **Storage** → **Policies** for the `photos` bucket
2. Find the "Public upload access" policy and click the three dots → **Delete**
3. Click **New Policy** to create an authenticated-only policy:
   - **Policy name:** `Authenticated upload access`
   - **Allowed operation:** INSERT
   - **Policy definition:** `auth.role() = 'authenticated'`
4. Keep the public read policy so photos can be viewed by anyone

### Update Database Policies for Authenticated Users (If You Started with Public Inserts)

If you initially allowed public inserts and want to switch to authenticated-only:

Run this SQL in the SQL Editor:

```sql
-- Drop the public insert policy if it exists
DROP POLICY IF EXISTS "Allow public insert" ON photo_sections;

-- Create authenticated-only insert policy
CREATE POLICY "Allow authenticated insert" ON photo_sections
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Optionally, restrict updates and deletes to authenticated users
CREATE POLICY "Allow authenticated update" ON photo_sections
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON photo_sections
  FOR DELETE 
  USING (auth.role() = 'authenticated');
```

**Note:** These policies work the same on localhost and production. Supabase policies are server-side and check authentication status regardless of where your app is running.

## 8. How Authentication Works on Localhost vs Production

**Important:** Supabase policies work identically on localhost and production because they're enforced server-side by Supabase, not by your local code.

### How It Works:

1. **Authentication Check:** When a user logs in through your app (on localhost or production), Supabase creates a session and stores it in the browser.

2. **Policy Enforcement:** When your app makes requests to Supabase (upload photos, insert database records), Supabase checks:
   - Is the user authenticated? (Do they have a valid session?)
   - Does the policy allow this operation for authenticated users?

3. **Same Behavior Everywhere:** Since Supabase runs in the cloud, the same policies apply whether your app runs on:
   - `http://localhost:8080` (development)
   - `https://yourdomain.com` (production)

### Testing on Localhost:

1. Make sure you're logged in to the admin panel (`/login`)
2. Try uploading a photo
3. If you get an error about permissions, check:
   - Are you actually logged in? (Check the user dropdown in the admin panel)
   - Are the storage policies set to require authentication?
   - Are the database policies set to require authentication?

### Common Issues:

**"new row violates row-level security policy"**
- This means the database policy requires authentication, but your session might have expired
- Solution: Log out and log back in

**"new object violates row-level security policy" (Storage)**
- This means the storage policy requires authentication, but your session might have expired
- Solution: Log out and log back in, or check that the storage policy uses `auth.role() = 'authenticated'`

## Security Notes

For production use, consider:
1. ✅ Authentication is now implemented - admin access is restricted
2. ✅ Storage uploads restricted to authenticated users only (see step 5, Option B)
3. ✅ Database inserts restricted to authenticated users only (see step 4)
4. Adding file type and size validation on the server side
5. Implementing rate limiting for uploads
6. Adding image optimization/compression
7. Disabling public user signups if you only want specific admins
8. Setting up email verification for admin accounts

## Quick Reference: Setting Up Authenticated-Only Uploads

If you want to restrict uploads to authenticated users only (works on both localhost and production):

### Step 1: Update Storage Policy

1. Go to **Storage** → **Policies** → Select `photos` bucket
2. Delete any existing "Public upload access" policy (if exists)
3. Create new policy:
   - **Name:** `Authenticated upload access`
   - **Operation:** INSERT
   - **Policy:** `auth.role() = 'authenticated'`
4. Keep the "Public read access" policy (SELECT with `true`) so photos can be viewed

### Step 2: Update Database Policy

Run this SQL in **SQL Editor**:

```sql
-- Remove public insert policy
DROP POLICY IF EXISTS "Allow public insert" ON photo_sections;

-- Add authenticated-only insert policy
CREATE POLICY "Allow authenticated insert" ON photo_sections
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Step 3: Verify It Works

1. Make sure you're logged in at `/login`
2. Go to `/admin` and try uploading a photo
3. It should work! The policies check authentication server-side, so they work on both localhost and production

**That's it!** Your uploads are now restricted to authenticated users only, and this works identically on localhost and production.
