/*
  # Update KPI schema

  1. Changes
    - Drop existing KPI table
    - Create new KPI table with updated schema
    - Add RLS policies
    - Add triggers

  2. Security
    - Enable RLS
    - Add organization-based access policies
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS kpis CASCADE;

-- Create new KPI table
CREATE TABLE IF NOT EXISTS kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  current_value numeric NOT NULL DEFAULT 0,
  target_value numeric NOT NULL,
  unit text NOT NULL,
  description text,
  scope_type text NOT NULL,
  scope_id uuid NOT NULL,
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view KPIs in their organization"
  ON kpis
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Users can create KPIs in their organization"
  ON kpis
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Users can update their organization's KPIs"
  ON kpis
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_kpis_updated_at
  BEFORE UPDATE ON kpis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();