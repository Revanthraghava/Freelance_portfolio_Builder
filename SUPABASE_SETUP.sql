-- Supabase Setup SQL for AI Portfolio Generator
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own portfolios
CREATE POLICY "Users can view their own portfolios" 
ON portfolios FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own portfolios
CREATE POLICY "Users can insert their own portfolios" 
ON portfolios FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own portfolios
CREATE POLICY "Users can update their own portfolios" 
ON portfolios FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own portfolios
CREATE POLICY "Users can delete their own portfolios" 
ON portfolios FOR DELETE 
USING (auth.uid() = user_id);

-- Create a function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON portfolios
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
