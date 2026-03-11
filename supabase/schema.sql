-- Supabase Schema for Pham Content Vault --
-- Paste this script into the Supabase SQL Editor and execute it. --

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  cover_image_url TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  type TEXT NOT NULL,          -- 'image', 'video', 'document'
  category TEXT NOT NULL,      -- 'Photos', 'Social Clips', etc.
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  format TEXT,
  size_mb NUMERIC,
  width INTEGER,
  height INTEGER,
  duration_sec NUMERIC,
  day_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,       -- Email or auth id
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
-- This setup allows authenticated users to read/write based on standard policies.
-- For the scope of this implementation, we will allow overarching read/write access 
-- to logged-in users, but you can restrict it further in Supabase dashboard.

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to all for now (Can be scoped to Authenticated Users later)
CREATE POLICY "Enable read access for all users" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.companies FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for all users" ON public.events FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.events FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for all users" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.media_assets FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for all users" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Insert dummy data into Companies for testing out the Create Project Form
INSERT INTO public.companies (name) VALUES ('TechSummit Inc.');
INSERT INTO public.companies (name) VALUES ('Innovate Finance');
