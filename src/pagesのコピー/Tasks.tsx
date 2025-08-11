import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { NewTaskModal } from '../components/NewTaskModal';
import { DroppableColumn } from '../components/DroppableColumn';
import { TaskDetailModal } from '../components/TaskDetailModal';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverEvent,
} from '@dnd-kit/core';
import { 
  Plus, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Filter, 
  Search,
  MoreVertical,
  ChevronDown,
  Brain,
  AlertTriangle,
  Sparkles,
  GripVertical,
  BarChart3
} from 'lucide-react';

export function Tasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState('board');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // ドラッグ&ドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // タスク一覧取得（シンプル版）
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', selectedFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('*, projects(title), task_results(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      // ステータスフィルタ
      if (selectedFilter !== 'all') {
        query = query.eq('status', selectedFilter);
      }

      // 検索クエリ
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Tasks fetch error:', error);
        throw error;
      }
      return data || [];
    },
    retry: 3,
    retryDelay: 1000
  });

  // プロジェクト一覧取得
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // タスクのステータス更新
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: string }) => {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // 完了時の処理
      if (newStatus === 'done') {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus !== 'done') {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      console.error('タスクの更新に失敗しました:', error);
      alert(`タスクの更新に失敗しました: ${error.message}`);
    }
  });

  const statuses = [
    { id: 'todo', label: '未着手' },
    { id: 'in_progress', label: '進行中' },
    { id: 'review', label: 'レビュー' },
    { id: 'done', label: '完了' }
  ];

  // ステータスごとにタスクを分類
  const tasksByStatus = statuses.reduce((acc: any, status) => {
    acc[status.id] = tasks.filter(task => task.status === status.id);
    return acc;
  }, {});

  // ドラッグ開始時
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // ドラッグ終了時
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    // ドロップ先のステータスを特定
    let newStatus: string;
    
    if (statuses.some(s => s.id === over.id)) {
      newStatus = over.id as string;
    } else {
      const targetTask = tasks.find(task => task.id === over.id);
      if (targetTask) {
        newStatus = targetTask.status;
      } else {
        const droppableId = over.data.current?.sortable?.containerId;
        if (droppableId && statuses.some(s => s.id === droppableId)) {
          newStatus = droppableId;
        } else {
          return;
        }
      }
    }

    if (activeTask.status !== newStatus) {
      updateTaskMutation.mutate({
        taskId: activeTask.id,
        newStatus: newStatus,
      });
    }
  };

  // タスククリック処理
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  // 分析データ計算（シンプル版）
  const analytics = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const overdue = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    ).length;
    const urgent = tasks.filter(t => t.priority === 'urgent').length;
    
    return {
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      overdue,
      urgent
    };
  }, [tasks]);

  // AI優先タスク（シンプル版）
  const aiPriorityTasks = React.useMemo(() => {
    return tasks
      .filter(task => task.status !== 'done')
      .sort((a, b) => {
        const priorityScore = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      })
      .slice(0, 3);
  }, [tasks]);

  const activeTask = tasks.find(task => task.id === activeId);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">タスクの読み込みに失敗しました。</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">タスク管理</h1>
          <p className="mt-1 text-gray-600">
            ドラッグ&ドロップでタスクのステータスを変更できます
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            分析
          </button>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規タスク
          </button>
        </div>
      </div>

      {/* 分析ダッシュボード */}
      {showAnalytics && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">タスク分析</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.total}</div>
              <div className="text-sm text-blue-800">総タスク数</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.completionRate}%</div>
              <div className="text-sm text-green-800">完了率</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{analytics.overdue}</div>
              <div className="text-sm text-red-800">期限切れ</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.urgent}</div>
              <div className="text-sm text-orange-800">緊急タスク</div>
            </div>
          </div>
        </div>
      )}

      {/* AI優先タスク */}
      {aiPriorityTasks.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI推奨：優先すべきタスク</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {aiPriorityTasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTaskClick(task.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.priority === 'urgent' ? '緊急' :
                     task.priority === 'high' ? '高' :
                     task.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                {task.due_date && (
                  <div className="text-sm text-gray-600">
                    期限: {new Date(task.due_date).toLocaleDateString('ja-JP')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 検索・フィルター */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* 検索 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="タスクを検索..."
              />
            </div>
          </div>
          
          {/* フィルター */}
          <div className="flex items-center gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全ステータス</option>
              {statuses.map(status => (
                <option key={status.id} value={status.id}>{status.label}</option>
              ))}
            </select>
            
            {/* ビューモード切り替え */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'board' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ボード
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                リスト
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* タスクビュー */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === 'board' ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statuses.map((status) => (
              <DroppableColumn
                key={status.id}
                id={status.id}
                title={status.label}
                tasks={tasksByStatus[status.id] || []}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
          <DragOverlay>
            {activeId && activeTask ? (
              <div className="bg-white rounded-lg shadow-2xl p-4 opacity-95 cursor-grabbing border border-blue-200">
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{activeTask.title}</p>
                    {activeTask.projects && (
                      <p className="text-xs text-gray-500 mt-1">{activeTask.projects.title}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <TaskList 
          tasks={tasks} 
          onTaskClick={handleTaskClick}
          onStatusChange={(taskId, newStatus) => {
            updateTaskMutation.mutate({ taskId, newStatus });
          }}
        />
      )}

      {/* 空の状態 */}
      {!isLoading && tasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">タスクがありません</h3>
          <p className="text-gray-500 mb-6">最初のタスクを作成して始めましょう</p>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規タスク作成
          </button>
        </div>
      )}

      {/* モーダル */}
      <NewTaskModal 
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
      />
      
      <TaskDetailModal
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        taskId={selectedTaskId || ''}
      />
    </div>
  );
}

// タスクリストコンポーネント（シンプル版）
function TaskList({ tasks, onTaskClick, onStatusChange }: { 
  tasks: any[]; 
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li 
              key={task.id} 
              onClick={() => onTaskClick(task.id)} 
              className={`cursor-pointer hover:bg-gray-50 ${
                task.status === 'todo' ? 'border-l-4 border-yellow-500' :
                task.status === 'in_progress' ? 'border-l-4 border-blue-500' :
                task.status === 'review' ? 'border-l-4 border-purple-500' :
                'border-l-4 border-green-500'
              }`}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newStatus = e.target.checked ? 'done' : 'todo';
                        onStatusChange(task.id, newStatus);
                      }}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'urgent' ? '緊急' :
                           task.priority === 'high' ? '高' :
                           task.priority === 'medium' ? '中' : '低'}
                        </span>
                        {task.ai_generated && (
                          <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                            <Sparkles className="h-3 w-3" />
                            AI生成
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    {task.projects && (
                      <p className="flex items-center text-sm text-gray-500">
                        <CheckSquare className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {task.projects.title}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {task.due_date && (
                      <>
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>期限: {new Date(task.due_date).toLocaleDateString('ja-JP')}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="px-4 py-12 text-center">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">タスクがありません</p>
          </li>
        )}
      </ul>
    </div>
  );
}