import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  TrendingUp,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import { supabase, Task, Project } from '../lib/supabase';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // タスクとプロジェクトを並行して取得
      const [tasksResponse, projectsResponse] = await Promise.all([
        supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      if (tasksResponse.error) throw tasksResponse.error;
      if (projectsResponse.error) throw projectsResponse.error;

      setTasks(tasksResponse.data || []);
      setProjects(projectsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  };

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(project => project.status === 'active').length;
    const completed = projects.filter(project => project.status === 'completed').length;
    
    return { total, active, completed };
  };

  const taskStats = getTaskStats();
  const projectStats = getProjectStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="mt-1 text-sm text-gray-500">
            今日のタスクとプロジェクトの概要
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            新規タスク
          </button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    完了タスク
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {taskStats.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    進行中タスク
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {taskStats.inProgress}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    未着手タスク
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {taskStats.pending}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    アクティブプロジェクト
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {projectStats.active}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近のタスク */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              最近のタスク
            </h3>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-400' :
                      task.status === 'in_progress' ? 'bg-yellow-400' :
                      'bg-gray-300'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {task.business_unit || '未分類'}
                      </p>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? '高' :
                       task.priority === 'medium' ? '中' : '低'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                まだタスクがありません
              </p>
            )}
          </div>
        </div>

        {/* アクティブプロジェクト */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              アクティブプロジェクト
            </h3>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.filter(p => p.status === 'active').slice(0, 3).map((project) => (
                  <div key={project.id} className="border-l-4 border-blue-400 pl-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      {project.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.business_unit}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {project.description || 'プロジェクト詳細なし'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                アクティブなプロジェクトがありません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}