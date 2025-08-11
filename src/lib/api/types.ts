// Supabaseテーブルに対応する型定義（SQLスキーマと完全一致）

export interface Project {
  id: string;
  title: string; // nameからtitleに変更
  description?: string;
  business_model: string; // 新規追加
  business_phase: 'PSF' | 'PMF' | 'Scale'; // 新規追加
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent'; // urgentを追加
  progress: number; // 新規追加
  deadline?: string; // due_dateからdeadlineに変更
  lean_canvas?: any; // JSONフィールド（リーンキャンバスデータ）
  kpis?: any[]; // JSONフィールド（選択されたKPIデータ）
  created_at: string;
  updated_at: string;
  user_id: string;
  organization_id?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done'; // completedからdoneに変更
  priority: 'low' | 'medium' | 'high' | 'urgent'; // urgentを追加
  task_type: 'manual' | 'ai_generated'; // 新規追加
  ai_generated: boolean; // 新規追加
  ai_generation_reason?: string; // 新規追加
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completed_at?: string; // 新規追加
  created_at: string;
  updated_at: string;
  user_id: string;
  project_id?: string;
}

export interface KPI {
  id: string;
  name: string;
  target: string;
  description?: string;
  project_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskResult {
  id: string;
  task_id: string;
  quantitative_data?: Record<string, any>; // JSONB型
  qualitative_data?: string;
  insights?: string;
  success_score?: number;
  created_at: string;
  completed_by: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

// 戦略ハブから渡されるデータの型
export interface StrategyHubData {
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  business_phase: 'PSF' | 'PMF' | 'Scale';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string | null;
  lean_canvas: {
    problemStatement: string;
    solution: string;
    uniqueValueProposition: string;
    unfairAdvantage: string;
    customerSegments: string;
    keyMetrics: string;
    channels: string;
    costStructure: string;
    revenueStreams: string;
  };
  kpis: Array<{
    id: string;
    name: string;
    target: string;
    description: string;
    selected: boolean;
  }>;
}

// NewBusinessWizardから渡されるデータの型（既存）
export interface BusinessData {
  idea: string;
  leanCanvas: {
    problemStatement: string;
    solution: string;
    uniqueValueProposition: string;
    targetCustomers: string;
    revenueStreams: string;
  };
  kpis: Array<{
    name: string;
    target: number;
    unit: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  projectName: string;
  initialTasks: string[];
}

// API リクエスト用の型（SQLスキーマに合わせて修正）
export interface CreateProjectRequest {
  title: string; // nameからtitleに変更
  description?: string;
  business_model?: string;
  business_phase?: 'PSF' | 'PMF' | 'Scale';
  status?: 'planning' | 'active' | 'completed' | 'on_hold';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  progress?: number;
  deadline?: string; // due_dateからdeadlineに変更
  lean_canvas?: any; // リーンキャンバスデータ
  kpis?: any[]; // 選択されたKPIデータ
  user_id: string;
  organization_id?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  task_type?: 'manual' | 'ai_generated';
  ai_generated?: boolean;
  ai_generation_reason?: string;
  due_date?: string;
  estimated_hours?: number;
  project_id?: string;
  user_id: string;
}

export interface CreateKPIRequest {
  name: string;
  target: string;
  description?: string;
  project_id: string;
  user_id: string;
}

// API レスポンス用の型
export interface ApiResponse<T> {
  data: T;
  error?: string;
}