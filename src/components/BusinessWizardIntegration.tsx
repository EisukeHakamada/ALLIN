import React from 'react';

// 既存のAPIフックとの統合を想定した型定義とヘルパー関数

export interface BusinessProjectData {
  name: string;
  description: string;
  businessIdea: string;
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
  initialTasks: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedHours?: number;
  }>;
}

// NewBusinessWizardからのデータを既存のプロジェクト作成APIに適合させる変換関数
export const transformBusinessDataToProject = (businessData: any): BusinessProjectData => {
  return {
    name: businessData.projectName,
    description: `${businessData.idea.slice(0, 200)}${businessData.idea.length > 200 ? '...' : ''}`,
    businessIdea: businessData.idea,
    leanCanvas: businessData.leanCanvas,
    kpis: businessData.kpis,
    initialTasks: businessData.initialTasks.map((task: string, index: number) => ({
      title: task,
      description: `新規事業立案プロセスで生成されたタスク ${index + 1}`,
      priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
      estimatedHours: 4, // デフォルト見積もり時間
    })),
  };
};

// 既存のuseCreateProjectフックを使用する際のデータ構造
export const createProjectFromBusinessWizard = async (
  businessData: any,
  createProjectMutation: any, // 既存のmutation関数
  createTaskMutation: any,    // 既存のタスク作成mutation
  createKPIMutation: any      // 既存のKPI作成mutation
) => {
  try {
    const projectData = transformBusinessDataToProject(businessData);
    
    // 1. プロジェクトを作成
    const project = await createProjectMutation.mutateAsync({
      name: projectData.name,
      description: projectData.description,
      // 既存のプロジェクト作成に必要な他のフィールドを追加
    });

    // 2. KPIを作成
    for (const kpi of projectData.kpis) {
      await createKPIMutation.mutateAsync({
        projectId: project.id,
        name: kpi.name,
        target: kpi.target,
        unit: kpi.unit,
        priority: kpi.priority,
      });
    }

    // 3. 初期タスクを作成
    for (const task of projectData.initialTasks) {
      await createTaskMutation.mutateAsync({
        projectId: project.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        estimatedHours: task.estimatedHours,
      });
    }

    // 4. 事業計画データをメタデータとして保存（将来のAI分析のため）
    // この部分は既存のAPIに応じて実装
    
    return project;
  } catch (error) {
    console.error('新規事業プロジェクトの作成に失敗しました:', error);
    throw error;
  }
};

// ダッシュボードやKPI管理画面で使用する事業フェーズの判定ロジック
export const getBusinessPhase = (project: any): 'ideation' | 'validation' | 'development' | 'launch' | 'growth' => {
  // プロジェクトの進捗状況やKPIの達成状況から事業フェーズを判定
  const progress = project.progress || 0;
  
  if (progress < 20) return 'ideation';
  if (progress < 40) return 'validation';
  if (progress < 70) return 'development';
  if (progress < 90) return 'launch';
  return 'growth';
};

// AIアシスタントとの連携用データ構造
export const prepareBusinessContextForAI = (project: any) => {
  return {
    phase: getBusinessPhase(project),
    leanCanvas: project.leanCanvas,
    currentKPIs: project.kpis,
    recentTasks: project.tasks?.slice(-5), // 最新5つのタスク
    businessIdea: project.businessIdea,
  };
};