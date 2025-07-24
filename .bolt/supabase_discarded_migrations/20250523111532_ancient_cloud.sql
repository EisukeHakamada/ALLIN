/*
  # KGI and KPI Management Schema

  1. New Tables
    - `kgis`: Key Goal Indicators
      - Organization-scoped goals with period settings
    - `kpis`: Key Performance Indicators
      - Metrics linked to KGIs with target and actual values
  
  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and management
    - Restrict admin operations to users with admin role
*/

-- KGIs table
CREATE TABLE IF NOT EXISTS kgis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  scope_type text NOT NULL,
  scope_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  period_type text NOT NULL,
  period_value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- KPIs table
CREATE TABLE IF NOT EXISTS kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kgi_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  aggregation text NOT NULL,
  unit text NOT NULL,
  target_value numeric NOT NULL,
  actual_value numeric DEFAULT 0,
  auto_collect boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_kgi FOREIGN KEY (kgi_id) REFERENCES kgis(id)
);

-- Enable RLS
ALTER TABLE kgis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

-- KGIs policies
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

CREATE POLICY "Admins can create KGIs"
  ON kgis
  FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
      AND users.organization_id = organization_id
    )
  );

CREATE POLICY "Admins can update KGIs"
  ON kgis
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
      AND users.organization_id = organization_id
    )
  );

-- KPIs policies
DO $$ 
BEGIN
  -- Users can view KPIs in their organization
  EXECUTE format('
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
    )
  ');

  -- Admins can create KPIs
  EXECUTE format('
    CREATE POLICY "Admins can create KPIs"
    ON kpis
    FOR INSERT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 
        FROM kgis
        JOIN users ON users.organization_id = kgis.organization_id
        WHERE kgis.id = kpis.kgi_id
        AND users.id = auth.uid()
        AND users.role = ''admin''
      )
    )
  ');

  -- Admins can update KPIs
  EXECUTE format('
    CREATE POLICY "Admins can update KPIs"
    ON kpis
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 
        FROM kgis
        JOIN users ON users.organization_id = kgis.organization_id
        WHERE kgis.id = kpis.kgi_id
        AND users.id = auth.uid()
        AND users.role = ''admin''
      )
    )
  ');
END $$;

-- Triggers for updated_at
CREATE TRIGGER update_kgis_updated_at
  BEFORE UPDATE ON kgis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at
  BEFORE UPDATE ON kpis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();