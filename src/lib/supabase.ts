import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// タスクの型定義
export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  project_id?: string
  business_unit?: string
  created_at: string
  updated_at: string
  user_id: string
}

// プロジェクトの型定義
export interface Project {
  id: string
  name: string
  description?: string
  status: 'planning' | 'active' | 'completed' | 'on_hold'
  business_unit: string
  goals?: string
  created_at: string
  updated_at: string
  user_id: string
}

// 連絡先の型定義
export interface Contact {
  id: string
  name: string
  company?: string
  role?: string
  email?: string
  phone?: string
  notes?: string
  created_at: string
  updated_at: string
  user_id: string
}