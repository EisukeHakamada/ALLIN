import { supabase } from '../supabase';
import { Project, Task, KPI, StrategyHubData, CreateKPIRequest } from './types';

// 新しいプロジェクトをDBに挿入し、そのデータを返す関数
export const createProject = async (projectData: Omit<Project, 'id' | 'created_at'>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single(); // .single() を使うことで、配列ではなく単一のオブジェクトを取得

  if (error) {
    console.error('Error creating project:', error);
    throw new Error(error.message);
  }
  return data;
};

// 新しいタスクをDBに挿入する関数
export const createTask = async (taskData: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message);
  }
  return data;
};

// 新しいKPIをDBに挿入する関数
export const createKPI = async (kpiData: CreateKPIRequest): Promise<KPI> => {
  const { data, error } = await supabase
    .from('kpis')
    .insert(kpiData)
    .select()
    .single();

  if (error) {
    console.error('Error creating KPI:', error);
    throw new Error(error.message);
  }
  return data;
};

// 戦略ハブ用：プロジェクト・タスク・KPIを一括作成する関数
export const createBusinessProjectPackage = async (strategyData: StrategyHubData & { user_id: string }) => {
  try {
    console.log('戦略ハブから事業プロジェクト一括作成開始:', strategyData);

    // ステップ1: プロジェクトを作成（戦略データも含める）
    const projectData: Omit<Project, 'id' | 'created_at'> = {
      title: strategyData.title,
      description: strategyData.description,
      business_model: 'startup', // デフォルト値
      business_phase: strategyData.business_phase,
      status: strategyData.status,
      priority: strategyData.priority,
      progress: 0, // 開始時は0%
      deadline: strategyData.due_date || undefined,
      lean_canvas: strategyData.lean_canvas, // ★ リーンキャンバスデータを保存
      kpis: strategyData.kpis.filter(kpi => kpi.selected), // ★ 選択されたKPIを保存
      user_id: strategyData.user_id,
      updated_at: new Date().toISOString()
    };

    const newProject = await createProject(projectData);
    console.log('プロジェクト作成完了（戦略データ含む）:', newProject);

    // ステップ2: AI初期タスクを自動生成
    const initialTasks = [
      {
        title: '顧客インタビューの実施',
        description: `${strategyData.lean_canvas.customerSegments}に対して、${strategyData.lean_canvas.problemStatement}について詳しくヒアリングする`,
        priority: 'urgent' as const,
        estimated_hours: 8
      },
      {
        title: '競合調査レポートの作成',
        description: `${strategyData.lean_canvas.solution}に関連する競合他社の分析を行い、差別化ポイントを明確にする`,
        priority: 'high' as const,
        estimated_hours: 12
      },
      {
        title: 'MVPの仕様策定',
        description: `${strategyData.lean_canvas.uniqueValueProposition}を検証するための最小限の機能を定義する`,
        priority: 'high' as const,
        estimated_hours: 16
      },
      {
        title: 'チャネル戦略の具体化',
        description: `${strategyData.lean_canvas.channels}での顧客獲得方法を具体的に計画する`,
        priority: 'medium' as const,
        estimated_hours: 6
      },
      {
        title: 'コスト構造の詳細設計',
        description: `${strategyData.lean_canvas.costStructure}を基に、詳細な事業計画を策定する`,
        priority: 'medium' as const,
        estimated_hours: 10
      }
    ];

    // ステップ3: タスクを一括作成
    const taskPromises = initialTasks.map((task, index) => {
      const taskData: Omit<Task, 'id' | 'created_at'> = {
        title: task.title,
        description: task.description,
        project_id: newProject.id,
        user_id: strategyData.user_id,
        status: 'todo',
        priority: task.priority,
        task_type: 'ai_generated',
        ai_generated: true,
        ai_generation_reason: `戦略ハブで生成されたリーンキャンバスを基に自動生成されたタスク`,
        estimated_hours: task.estimated_hours,
        due_date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(), // 1週間ずつずらす
        updated_at: new Date().toISOString()
      };
      return createTask(taskData);
    });

    const createdTasks = await Promise.all(taskPromises);
    console.log('タスク作成完了:', createdTasks);

    // ステップ4: 選択されたKPIを作成（一時的に無効化）
    const selectedKPIs = strategyData.kpis.filter(kpi => kpi.selected);
    console.log('選択されたKPI:', selectedKPIs);
    console.warn('KPIテーブルが存在しないため、KPI作成をスキップします');
    
    // KPI作成をスキップして、空配列を設定
    const createdKPIs: KPI[] = [];

    return {
      project: newProject,
      tasks: createdTasks,
      kpis: createdKPIs,
      strategyData
    };

  } catch (error) {
    console.error('事業プロジェクト一括作成エラー:', error);
    throw error;
  }
};

// プロジェクトの戦略を更新する関数
export const updateProjectStrategy = async (
  projectId: string, 
  strategyData: { lean_canvas: any; kpis: any[] }
): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      lean_canvas: strategyData.lean_canvas,
      kpis: strategyData.kpis,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project strategy:', error);
    throw new Error(error.message);
  }
  
  console.log('プロジェクト戦略更新完了:', data);
  return data;
};

// 特定のプロジェクト詳細を取得する関数
export const fetchProjectById = async (projectId: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project by id:', error);
    throw new Error(error.message);
  }
  return data;
};

// 特定プロジェクトのKPI一覧を取得する関数
export const fetchKpisByProjectId = async (projectId: string): Promise<KPI[]> => {
  const { data, error } = await supabase
    .from('kpis')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching KPIs by project id:', error);
    throw new Error(error.message);
  }
  return data || [];
};

// プロジェクト一覧を取得する関数
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error(error.message);
  }
  return data || [];
};

// 特定プロジェクトのタスク一覧を取得する関数
export const fetchTasksByProject = async (projectId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message);
  }
  return data || [];
};