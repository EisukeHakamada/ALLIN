/*
  # Initial schema setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (text)
      - `avatar` (text)
      - `organization_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `plan` (text)
      - `logo` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan text NOT NULL DEFAULT 'free',
  logo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'member',
  avatar text,
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Organization policies
CREATE POLICY "Users can view their own organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT organization_id 
    FROM users 
    WHERE users.id = auth.uid()
  ));

CREATE POLICY "Organization admins can update their organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (id IN (
    SELECT organization_id 
    FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  ));

-- User policies
CREATE POLICY "Users can view members of their organization"
  ON users
  FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id 
    FROM users 
    WHERE users.id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();