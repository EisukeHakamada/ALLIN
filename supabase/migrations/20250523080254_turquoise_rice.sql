/*
  # Business Intelligence Schema

  1. New Tables
    - `projects`: Project management
    - `tasks`: Task tracking
    - `kpis`: Key Performance Indicators
    - `revenue_data`: Revenue tracking
    - `alerts`: System alerts
    - `sales_pipeline`: Sales opportunity tracking

  2. Security
    - Enable RLS on all tables
    - Add organization-based access policies
    - Ensure proper data isolation between organizations
*/

-- Projects table (must be first due to foreign key references)
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL,
  progress integer NOT NULL DEFAULT 0,
  forecast_revenue numeric NOT NULL DEFAULT 0,
  actual_revenue numeric NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- KPIs table
CREATE TABLE IF NOT EXISTS kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL,
  scope_id uuid NOT NULL,
  name text NOT NULL,
  current_value numeric NOT NULL,
  target_value numeric NOT NULL,
  unit text NOT NULL,
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Revenue data table
CREATE TABLE IF NOT EXISTS revenue_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL,
  scope_id uuid NOT NULL,
  date date NOT NULL,
  actual_revenue numeric NOT NULL,
  target_revenue numeric NOT NULL,
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL,
  priority text NOT NULL,
  due_date timestamptz NOT NULL,
  project_id uuid REFERENCES projects(id),
  assignee_id uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  priority text NOT NULL,
  message text NOT NULL,
  detail text,
  scope_type text NOT NULL,
  scope_id uuid NOT NULL,
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now()
);

-- Sales pipeline table
CREATE TABLE IF NOT EXISTS sales_pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage text NOT NULL,
  opportunity_name text NOT NULL,
  value numeric NOT NULL,
  probability integer NOT NULL,
  expected_close_date date NOT NULL,
  owner_id uuid REFERENCES auth.users(id),
  organization_id uuid REFERENCES organizations(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_pipeline ENABLE ROW LEVEL SECURITY;

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

-- Projects policies
CREATE POLICY "Users can view projects in their organization"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Users can view tasks in their organization"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Revenue data policies
CREATE POLICY "Users can view revenue data in their organization"
  ON revenue_data
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Alerts policies
CREATE POLICY "Users can view alerts in their organization"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Sales pipeline policies
CREATE POLICY "Users can view sales pipeline in their organization"
  ON sales_pipeline
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_kpis_updated_at
  BEFORE UPDATE ON kpis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_pipeline_updated_at
  BEFORE UPDATE ON sales_pipeline
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();