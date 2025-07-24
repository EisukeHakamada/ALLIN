/*
  # KGI and KPI Tables Setup

  1. New Tables
    - `kgis` (Key Goal Indicators)
      - Parent indicators for tracking high-level business objectives
      - Supports hierarchical structure with parent_kgi_id
      - Includes scope and period settings
    
    - `kpis` (Key Performance Indicators)
      - Child indicators that contribute to KGI achievement
      - Links to parent KGI
      - Tracks actual vs target values

  2. Security
    - Enable RLS on both tables
    - Add policies for organization-based access control
    - Only admins can modify data
*/

-- KGI (Parent Indicators) table
CREATE TABLE IF NOT EXISTS kgis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  parent_kgi_id UUID REFERENCES kgis(id),
  scope_type TEXT NOT NULL,
  scope_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  period_type TEXT NOT NULL,
  period_value TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),

  -- Validate period_type
  CONSTRAINT valid_period_type CHECK (period_type IN ('year', 'quarter', 'month')),
  
  -- Validate scope_type
  CONSTRAINT valid_scope_type CHECK (scope_type IN ('organization', 'division', 'team', 'user'))
);

-- KPI (Child Indicators) table
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kgi_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC NOT NULL,
  actual_value NUMERIC DEFAULT 0,
  unit TEXT NOT NULL,
  auto_collect BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add foreign key constraint after table creation
ALTER TABLE kpis 
ADD CONSTRAINT kpis_kgi_id_fkey 
FOREIGN KEY (kgi_id) 
REFERENCES kgis(id);

-- Enable RLS
ALTER TABLE kgis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

-- KGI Policies
CREATE POLICY "Users can view KGIs in their organization"
  ON kgis
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can insert KGIs"
  ON kgis
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update KGIs"
  ON kgis
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete KGIs"
  ON kgis
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- KPI Policies
CREATE POLICY "Users can view KPIs in their organization"
  ON kpis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM kgis 
      WHERE kgis.id = kpis.kgi_id 
      AND kgis.organization_id IN (
        SELECT organization_id 
        FROM users 
        WHERE users.id = auth.uid()
      )
    )
  );

CREATE POLICY "Only admins can insert KPIs"
  ON kpis
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update KPIs"
  ON kpis
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete KPIs"
  ON kpis
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_kgis_updated_at
  BEFORE UPDATE ON kgis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at
  BEFORE UPDATE ON kpis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();