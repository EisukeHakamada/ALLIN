import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export function NewTaskModal({ isOpen, onClose, projectId }: NewTaskModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in_progress' | 'review' | 'done',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    projectId: projectId || '',
    dueDate: '',
    estimatedHours: ''
  });

  // プロジェクト一覧を取得（プロジェクト選択用）
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

  // タスク作成のmutation
  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            project_id: formData.projectId || null,
            due_date: formData.dueDate || null,
            estimated_hours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
            user_id: user!.id,
            ai_generated: false,
            task_type: 'manual'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // タスク一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        projectId: projectId || '',
        dueDate: '',
        estimatedHours: ''
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Error creating task:', error);
      alert(`タスクの作成に失敗しました: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('タスク名を入力してください');
      return;
    }
    createTaskMutation.mutate();
  };

  // AI提案タスク（将来の実装用）
  const aiSuggestedTasks = [
    { title: '顧客インタビュー実施（5件）', priority: 'urgent', reason: 'PSF検証に必須' },
    { title: '競合分析レポート作成', priority: 'high', reason: 'PMF判定に必要' },
    { title: 'MVPフィードバック収集', priority: 'medium', reason: '改善点の特定' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">新規タスク作成</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* AI提案（将来の実装用） */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">AI提案タスク</h3>
          </div>
          <div className="space-y-2">
            {aiSuggestedTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-600">{task.reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, title: task.title, priority: task.priority as any })}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  使用
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* タスク名 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              タスク名 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例：顧客インタビュー実施"
              required
            />
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="タスクの詳細を記入してください"
            />
          </div>

          {/* プロジェクトとステータス */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                プロジェクト
              </label>
              <select
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">プロジェクトなし</option>
                {projects?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todo">未着手</option>
                <option value="in_progress">進行中</option>
                <option value="review">レビュー</option>
                <option value="done">完了</option>
              </select>
            </div>
          </div>

          {/* 優先度と期限 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                優先度
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">緊急</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                期限
              </label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 見積時間 */}
          <div>
            <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
              見積時間（時間）
            </label>
            <input
              id="estimatedHours"
              type="number"
              step="0.5"
              min="0"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例：2.5"
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTaskMutation.isPending ? '作成中...' : 'タスクを作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}