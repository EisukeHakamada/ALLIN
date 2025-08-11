import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, createTask, fetchProjects, fetchTasksByProject, createBusinessProjectPackage, fetchProjectById, fetchKpisByProjectId, updateProjectStrategy } from './client';
import { BusinessData, CreateProjectRequest, CreateTaskRequest, Project, Task, StrategyHubData } from './types';
import { getCurrentUserId } from '../supabase';

// 戦略ハブ用：新規事業プロジェクト一括作成フック
export const useCreateBusinessProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (strategyData: StrategyHubData) => {
      try {
        console.log('戦略ハブからプロジェクト作成開始:', strategyData);

        // 現在のユーザーIDを取得
        const currentUserId = await getCurrentUserId();
        if (!currentUserId) {
          throw new Error('ユーザーが認証されていません');
        }

        // ユーザーIDを追加してAPI呼び出し
        const result = await createBusinessProjectPackage({
          ...strategyData,
          user_id: currentUserId
        });

        return result;

      } catch (error) {
        console.error('戦略ハブからのプロジェクト作成エラー:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('戦略ハブプロジェクト作成成功:', result);
      
      // プロジェクト一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // 作成されたプロジェクトのタスクキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: ['tasks', result.project.id] });
      
      console.log(`プロジェクト「${result.project.title}」が正常に作成されました`);
    },
    onError: (error) => {
      console.error("戦略ハブからのプロジェクト作成失敗:", error);
    }
  });
};

// 既存のBusinessWizard用フック（後方互換性のため保持）
export const useCreateBusinessProjectLegacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessData: BusinessData) => {
      try {
        console.log('新規事業プロジェクト作成開始:', businessData);

        // 現在のユーザーIDを取得
        const currentUserId = await getCurrentUserId();
        if (!currentUserId) {
          throw new Error('ユーザーが認証されていません');
        }

        // ステップA: プロジェクトを作成（SQLスキーマに合わせて修正）
        const newProjectData: CreateProjectRequest = {
          title: businessData.projectName, // nameからtitleに変更
          description: `${businessData.idea.slice(0, 200)}${businessData.idea.length > 200 ? '...' : ''}`,
          business_model: 'saas', // デフォルト値
          business_phase: 'PSF', // 新規事業はPSFフェーズから開始
          status: 'active',
          priority: 'high', // 新規事業は高優先度
          progress: 0, // 開始時は0%
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3ヶ月後
          user_id: currentUserId,
        };

        const newProject = await createProject(newProjectData);
        console.log('プロジェクト作成完了:', newProject);

        // ステップB: 作成したプロジェクトのIDを使って、タスクを連続で作成
        const taskPromises = businessData.initialTasks.map((taskTitle, index) => {
          const newTaskData: CreateTaskRequest = {
            title: taskTitle,
            description: `新規事業立案プロセスで生成されたタスク ${index + 1}`,
            project_id: newProject.id,
            user_id: currentUserId,
            status: 'todo',
            priority: index < 2 ? 'urgent' : index < 4 ? 'high' : 'medium', // urgentも使用
            task_type: 'ai_generated', // AIで生成されたタスク
            ai_generated: true,
            ai_generation_reason: `新規事業立案フローで${businessData.leanCanvas.problemStatement}の課題解決のために生成`,
            estimated_hours: 4, // デフォルト見積もり時間
          };
          return createTask(newTaskData);
        });

        // 全てのタスク作成が完了するのを待つ
        const createdTasks = await Promise.all(taskPromises);
        console.log('タスク作成完了:', createdTasks);

        // TODO: KPI作成の実装（KPIテーブルが準備でき次第）
        // 現在のSQLスキーマにはKPIテーブルがないため、将来実装

        return {
          project: newProject,
          tasks: createdTasks,
          businessData,
        };

      } catch (error) {
        console.error('新規事業プロジェクト作成エラー:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('新規事業プロジェクト作成成功:', result);
      
      // ステップC: 成功したら、プロジェクト一覧のキャッシュを無効化する
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // 作成されたプロジェクトのタスクキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: ['tasks', result.project.id] });
      
      // 成功通知（将来的にトーストライブラリで実装）
      console.log(`プロジェクト「${result.project.title}」が正常に作成されました`); // nameからtitleに変更
    },
    onError: (error) => {
      console.error("Business project creation failed:", error);
      // ここでエラー通知（トーストなど）を出すのが望ましい
    }
  });
};

// プロジェクト一覧取得フック
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを新鮮とみなす
  });
};

// プロジェクト詳細取得フック
export const useProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectById(projectId),
    enabled: !!projectId, // projectIdが存在する場合のみクエリを実行
    staleTime: 5 * 60 * 1000,
  });
};

// プロジェクトのKPI一覧取得フック
export const useProjectKpis = (projectId: string) => {
  return useQuery({
    queryKey: ['kpis', projectId],
    queryFn: () => fetchKpisByProjectId(projectId),
    enabled: !!projectId, // projectIdが存在する場合のみクエリを実行
    staleTime: 5 * 60 * 1000,
  });
};

// プロジェクト戦略更新フック
export const useUpdateProjectStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: string; strategyData: { lean_canvas: any; kpis: any[] } }) => {
      return updateProjectStrategy(data.projectId, data.strategyData);
    },
    onSuccess: (updatedProject) => {
      console.log('戦略更新成功:', updatedProject);
      
      // プロジェクト詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ['project', updatedProject.id] });
      
      // プロジェクト一覧のキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error("戦略更新失敗:", error);
    }
  });
};

// 特定プロジェクトのタスク一覧取得フック
export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasksByProject(projectId),
    enabled: !!projectId, // projectIdが存在する場合のみクエリを実行
  });
};

// 通常のプロジェクト作成フック
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: Omit<CreateProjectRequest, 'user_id'>) => {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        throw new Error('ユーザーが認証されていません');
      }

      const fullProjectData: CreateProjectRequest = {
        ...projectData,
        user_id: currentUserId,
      };
      return createProject(fullProjectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error("Project creation failed:", error);
    }
  });
};

// タスク作成フック
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: Omit<CreateTaskRequest, 'user_id'>) => {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        throw new Error('ユーザーが認証されていません');
      }

      const fullTaskData: CreateTaskRequest = {
        ...taskData,
        user_id: currentUserId,
      };
      return createTask(fullTaskData);
    },
    onSuccess: (newTask) => {
      // プロジェクトのタスク一覧を無効化
      if (newTask.project_id) {
        queryClient.invalidateQueries({ queryKey: ['tasks', newTask.project_id] });
      }
    },
    onError: (error) => {
      console.error("Task creation failed:", error);
    }
  });
};