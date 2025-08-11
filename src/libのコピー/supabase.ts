import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義（データベースと同期）
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          business_model: string;
          business_phase: 'PSF' | 'PMF' | 'Scale';
          status: 'planning' | 'active' | 'completed' | 'on_hold';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          progress: number;
          deadline: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
          organization_id: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          business_model?: string;
          business_phase?: 'PSF' | 'PMF' | 'Scale';
          status?: 'planning' | 'active' | 'completed' | 'on_hold';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          progress?: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          organization_id?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          business_model?: string;
          business_phase?: 'PSF' | 'PMF' | 'Scale';
          status?: 'planning' | 'active' | 'completed' | 'on_hold';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          progress?: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          organization_id?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'review' | 'done';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          task_type: 'manual' | 'ai_generated';
          ai_generated: boolean;
          ai_generation_reason: string | null;
          due_date: string | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          created_at: string;
          updated_at: string;
          user_id: string;
          project_id: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'review' | 'done';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          task_type?: 'manual' | 'ai_generated';
          ai_generated?: boolean;
          ai_generation_reason?: string | null;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          project_id?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'review' | 'done';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          task_type?: 'manual' | 'ai_generated';
          ai_generated?: boolean;
          ai_generation_reason?: string | null;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          project_id?: string | null;
          completed_at?: string | null;
        };
      };
      task_results: {
        Row: {
          id: string;
          task_id: string;
          quantitative_data: any | null;
          qualitative_data: string | null;
          insights: string | null;
          success_score: number | null;
          created_at: string;
          completed_by: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          quantitative_data?: any | null;
          qualitative_data?: string | null;
          insights?: string | null;
          success_score?: number | null;
          created_at?: string;
          completed_by: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          quantitative_data?: any | null;
          qualitative_data?: string | null;
          insights?: string | null;
          success_score?: number | null;
          created_at?: string;
          completed_by?: string;
        };
      };
    };
  };
};

// 型エイリアス
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskResult = Database['public']['Tables']['task_results']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];