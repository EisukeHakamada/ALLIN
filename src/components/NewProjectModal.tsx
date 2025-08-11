import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    businessModel: 'saas',
    businessPhase: 'PSF' as 'PSF' | 'PMF' | 'Scale',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    deadline: ''
  });

  // プロジェクト作成のmutation
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            business_model: formData.businessModel,
            business_phase: formData.businessPhase,
            priority: formData.priority,
            deadline: formData.deadline || null,
            user_id: user!.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // プロジェクト一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        businessModel: 'saas',
        businessPhase: 'PSF',
        priority: 'medium',
        deadline: ''
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      alert('プロジェクトの作成に失敗しました');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('プロジェクト名を入力してください');
      return;
    }
    createProjectMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">新規プロジェクト作成</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* プロジェクト名 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              プロジェクト名 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例：ECサイト改善プロジェクト"
              required
            />
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              プロジェクトの説明
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="プロジェクトの目的や背景を記入してください"
            />
          </div>

          {/* ビジネスモデルとフェーズ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessModel" className="block text-sm font-medium text-gray-700 mb-1">
                ビジネスモデル
              </label>
              <select
                id="businessModel"
                value={formData.businessModel}
                onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="saas">SaaS</option>
                <option value="ecommerce">Eコマース</option>
                <option value="marketplace">マーケットプレイス</option>
                <option value="consulting">コンサルティング</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="businessPhase" className="block text-sm font-medium text-gray-700 mb-1">
                ビジネスフェーズ
              </label>
              <select
                id="businessPhase"
                value={formData.businessPhase}
                onChange={(e) => setFormData({ ...formData, businessPhase: e.target.value as 'PSF' | 'PMF' | 'Scale' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PSF">PSF（Problem-Solution Fit）</option>
                <option value="PMF">PMF（Product-Market Fit）</option>
                <option value="Scale">Scale（事業拡大）</option>
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
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">緊急</option>
              </select>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                期限
              </label>
              <input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* フェーズ説明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">ビジネスフェーズについて</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>PSF:</strong> 課題と解決策の適合性を検証する段階</li>
              <li><strong>PMF:</strong> 製品と市場の適合性を検証する段階</li>
              <li><strong>Scale:</strong> 事業を拡大・成長させる段階</li>
            </ul>
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
              disabled={createProjectMutation.isPending}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createProjectMutation.isPending ? '作成中...' : 'プロジェクトを作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}