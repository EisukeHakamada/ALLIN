import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, Edit3, Trash2, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

export function TaskDetailModal({ isOpen, onClose, taskId }: TaskDetailModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in_progress' | 'review' | 'done',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    projectId: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: ''
  });
  const [taskResult, setTaskResult] = useState({
    quantitativeData: '',
    qualitativeData: '',
    insights: '',
    successScore: ''
  });

  // タスク詳細取得
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, projects(title)')
        .eq('id', taskId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!taskId
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

  // タスク結果取得
  const { data: existingResult } = useQuery({
    queryKey: ['task-result', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_results')
        .select('*')
        .eq('task_id', taskId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: isOpen && !!taskId && task?.status === 'done'
  });

  // フォームデータを初期化
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        projectId: task.project_id || '',
        dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        estimatedHours: task.estimated_hours?.toString() || '',
        actualHours: task.actual_hours?.toString() || ''
      });
    }
    if (existingResult) {
      setTaskResult({
        quantitativeData: existingResult.quantitative_data ? JSON.stringify(existingResult.quantitative_data) : '',
        qualitativeData: existingResult.qualitative_data || '',
        insights: existingResult.insights || '',
        successScore: existingResult.success_score?.toString() || ''
      });
    }
  }, [task, existingResult]);

  // タスク更新
  const updateTaskMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          project_id: formData.projectId || null,
          due_date: formData.dueDate || null,
          estimated_hours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
          actual_hours: formData.actualHours ? parseFloat(formData.actualHours) : null,
          completed_at: formData.status === 'done' ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;

      // 完了時の結果を保存
      if (formData.status === 'done' && (taskResult.qualitativeData || taskResult.insights)) {
        const resultData: any = {
          task_id: taskId,
          qualitative_data: taskResult.qualitativeData || null,
          insights: taskResult.insights || null,
          success_score: taskResult.successScore ? parseFloat(taskResult.successScore) : null,
          completed_by: user!.id
        };

        // quantitative_dataの安全な処理
        if (taskResult.quantitativeData) {
          try {
            resultData.quantitative_data = JSON.parse(taskResult.quantitativeData);
          } catch (e) {
            resultData.quantitative_data = taskResult.quantitativeData;
          }
        } else {
          resultData.quantitative_data = null;
        }

        // 既存の結果がある場合はIDを設定
        if (existingResult?.id) {
          resultData.id = existingResult.id;
        }

        const { error: resultError } = await supabase
          .from('task_results')
          .upsert(resultData);

        if (resultError) throw resultError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('タスクの更新に失敗しました:', error);
      alert('タスクの更新に失敗しました');
    }
  });

  // タスク削除
  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error) => {
      console.error('タスクの削除に失敗しました:', error);
      alert('タスクの削除に失敗しました');
    }
  });

  const handleDelete = () => {
    if (window.confirm('このタスクを削除してもよろしいですか？')) {
      deleteTaskMutation.mutate();
    }
  };

  const statusLabels = {
    todo: '未着手',
    in_progress: '進行中',
    review: 'レビュー',
    done: '完了'
  };

  const priorityLabels = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '緊急'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">タスクの詳細</h2>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <Edit3 className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => updateTaskMutation.mutate()}
                disabled={updateTaskMutation.isPending}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-1" />
                保存
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : task ? (
          <div className="p-6 space-y-6">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">タスク名</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{task.title}</p>
              )}
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{task.description || '（説明なし）'}</p>
              )}
            </div>

            {/* 基本情報 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                {isEditing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{statusLabels[task.status]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                {isEditing ? (
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(priorityLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{priorityLabels[task.priority]}</p>
                )}
              </div>
            </div>

            {/* プロジェクトと期限 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プロジェクト</label>
                {isEditing ? (
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">プロジェクトなし</option>
                    {projects?.map((project) => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{task.projects?.title || '（プロジェクトなし）'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">期限</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString('ja-JP') : '（期限なし）'}
                  </p>
                )}
              </div>
            </div>

            {/* 時間管理 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">見積時間（時間）</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.5"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{task.estimated_hours || '（未設定）'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">実績時間（時間）</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.5"
                    value={formData.actualHours}
                    onChange={(e) => setFormData({ ...formData, actualHours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{task.actual_hours || '（未入力）'}</p>
                )}
              </div>
            </div>

            {/* タスク完了時の結果入力 */}
            {(formData.status === 'done' || task.status === 'done') && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  タスク完了結果
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      定性的な結果・気づき
                    </label>
                    {isEditing ? (
                      <textarea
                        value={taskResult.qualitativeData}
                        onChange={(e) => setTaskResult({ ...taskResult, qualitativeData: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="このタスクを通じて得られた気づきや学びを記入してください"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {existingResult?.qualitative_data || '（未入力）'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      次への示唆・アクション
                    </label>
                    {isEditing ? (
                      <textarea
                        value={taskResult.insights}
                        onChange={(e) => setTaskResult({ ...taskResult, insights: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="この結果から導き出される次のアクションは？"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {existingResult?.insights || '（未入力）'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      成功度（0-10）
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={taskResult.successScore}
                        onChange={(e) => setTaskResult({ ...taskResult, successScore: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="このタスクの成功度を0-10で評価"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {existingResult?.success_score != null ? existingResult.success_score : '（未評価）'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* メタ情報 */}
            <div className="text-sm text-gray-500 space-y-1 border-t pt-4">
              <p>作成日時: {new Date(task.created_at).toLocaleString('ja-JP')}</p>
              <p>更新日時: {new Date(task.updated_at).toLocaleString('ja-JP')}</p>
              {task.completed_at && (
                <p>完了日時: {new Date(task.completed_at).toLocaleString('ja-JP')}</p>
              )}
              {task.ai_generated && (
                <p className="text-purple-600">🤖 AI生成タスク</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            タスクが見つかりません
          </div>
        )}
      </div>
    </div>
  );
}