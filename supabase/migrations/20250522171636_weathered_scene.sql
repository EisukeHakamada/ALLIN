/*
  # Authentication Tables Setup

  1. New Tables
    - `auth_users`
      - Extends Supabase's built-in auth.users table with additional user data
      - Links to organizations table for team management
    - `auth_sessions`
      - Stores user session information
      - Handles "remember me" functionality

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access control
*/

-- Auth Users Extension
CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auth Sessions
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth_users(id) ON DELETE CASCADE,
  refresh_token text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  user_agent text,
  ip_address inet
);

-- Enable RLS
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;

-- Auth Users Policies
CREATE POLICY "Users can read their own auth data"
  ON auth_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own auth data"
  ON auth_users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Auth Sessions Policies
CREATE POLICY "Users can manage their own sessions"
  ON auth_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger for updating updated_at
CREATE TRIGGER update_auth_users_updated_at
  BEFORE UPDATE ON auth_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();