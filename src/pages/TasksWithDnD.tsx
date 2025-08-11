import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { NewTaskModal } from '../components/NewTaskModal';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
  GripVertical
} from 'lucide-react';
import { SortableTaskCard } from '../components/SortableTaskCard';

export function TasksWithDnD() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('board');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  // ドラッグ&ドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // タスク一覧取得
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', selectedFilter],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('*, projects(title)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (selectedFilter !== 'all') {
        query = query.eq('status', selectedFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // タスクのステータス更新
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, newStatus }: { taskId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const statuses = ['todo', 'in_progress', 'review', 'done'];
  const statusLabels = {
    todo: '未着手',
    in_progress: '進行中',
    review: 'レビュー',
    done: '完了'
  };

  const tasksByStatus = statuses.reduce((acc: any, status) => {
    acc[status] = tasks?.filter(task => task.status === status) || [];
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

    const activeTask = tasks?.find(task => task.id === active.id);
    if (!activeTask) return;

    // 新しいステータスを取得
    const newStatus = over.id as string;
    if (activeTask.status !== newStatus) {
      updateTaskMutation.mutate({
        taskId: activeTask.id,
        newStatus: newStatus,
      });
    }
  };

  // AI優先タスク（ダミー）
  const aiPriorityTasks = [
    {
      id: 1,
      title: '顧客インタビュー実施（残り2件）',
      reason: 'PSF検証期限まで2日、成功確率に直結',
      urgency: 'urgent',
      deadline: '今日'
    },
    {
      id: 2,
      title: '競合分析レポート作成',
      reason: 'PMF判定に必要、今週中に方向性決定が必要',
      urgency: 'high',
      deadline: '明日'
    }
  ];

  const activeTask = tasks?.find(task => task.id === activeId);

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">タスク管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            ドラッグ&ドロップでタスクのステータスを変更できます
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            新規タスク
          </button>
        </div>
      </div>

      {/* AI優先タスク */}
      <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI優先タスク</h3>
        </div>
        <div className="space-y-3">
          {aiPriorityTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${
                  task.urgency === 'urgent' ? 'text-red-500' : 'text-orange-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{task.reason}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-red-600">
                期限: {task.deadline}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 検索とフィルター */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="タスクを検索"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                フィルター
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* タスクボード（ドラッグ&ドロップ対応） */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {statuses.map((status) => (
              <div key={status} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center justify-between">
                    <span>{statusLabels[status as keyof typeof statusLabels]}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {tasksByStatus[status].length}
                    </span>
                  </h3>
                </div>
                <div className="p-2 min-h-[200px]">
                  <SortableContext
                    id={status}
                    items={tasksByStatus[status].map((task: any) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="space-y-2">
                      {tasksByStatus[status].map((task: any) => (
                        <SortableTaskCard key={task.id} task={task} />
                      ))}
                    </ul>
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeId && activeTask ? (
              <div className="bg-white rounded-lg shadow-lg p-4 opacity-90">
                <p className="font-medium text-gray-900">{activeTask.title}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* 新規タスクモーダル */}
      <NewTaskModal 
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
      />
    </div>
  );
}