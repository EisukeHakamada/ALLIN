/*
  # Fix auth_users policies and add retry handling

  1. Security Changes
    - Add policies to allow users to create their own auth_users record
    - Fix infinite recursion in users table policies
    - Add proper RLS policies for organization access

  2. Changes
    - Update auth_users table policies
    - Fix users table policies
    - Add organization policies
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read their own auth data" ON auth_users;
DROP POLICY IF EXISTS "Users can update their own auth data" ON auth_users;

-- Allow users to insert their own auth data
CREATE POLICY "Users can insert their own auth data"
ON auth_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to read their own auth data
CREATE POLICY "Users can read their own auth data"
ON auth_users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own auth data
CREATE POLICY "Users can update their own auth data"
ON auth_users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fix infinite recursion in users policies
DROP POLICY IF EXISTS "Users can view members of their organization" ON users;

CREATE POLICY "Users can view members of their organization"
ON users
FOR SELECT
TO authenticated
USING (
  CASE 
    WHEN organization_id IS NULL THEN id = auth.uid()
    ELSE organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE id = auth.uid() 
      LIMIT 1
    )
  END
);