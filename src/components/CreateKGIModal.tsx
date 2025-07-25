import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '../lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import type { ScopeType } from '../lib/api/types';

interface CreateKGIModalProps {
  isOpen: boolean;
  onClose: () => void;
  scope: {
    type: ScopeType;
    id: string;
  };z
  parentKgiId?: string;
}

export const CreateKGIModal: React.FC<CreateKGIModalProps> = ({ isOpen, onClose, scope, parentKgiId }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    periodType: 'year',
    periodValue: new Date().getFullYear().toString(),
    targetValue: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await api.createKGI({
        organization_id: scope.id, // Assuming scope.id is the organization ID
        parent_kgi_id: parentKgiId,
        scope_type: scope.type,
        scope_id: scope.id,
        name: formData.name,
        description: formData.description || null,
        period_type: formData.periodType,
        period_value: formData.periodValue,
        target_value: Number(formData.targetValue),
      });

      // Invalidate KGIs query to trigger a refetch
      await queryClient.invalidateQueries(['kgis']);

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        periodType: 'year',
        periodValue: new Date().getFullYear().toString(),
        targetValue: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating KGI:', error);
      setError('KGIの作成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">閉じる</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                新規KGI作成
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  新しいKGIを作成します。必要な情報を入力してください。
                </p>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    指標名
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    disabled={isSubmitting}
                    placeholder="売上、顧客数、平均単価など"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    説明
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="periodType" className="block text-sm font-medium text-gray-700">
                    期間種別
                  </label>
                  <select
                    id="periodType"
                    name="periodType"
                    value={formData.periodType}
                    onChange={(e) => setFormData({ ...formData, periodType: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isSubmitting}
                  >
                    <option value="year">年間</option>
                    <option value="quarter">四半期</option>
                    <option value="month">月間</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="periodValue" className="block text-sm font-medium text-gray-700">
                    期間
                  </label>
                  <input
                    type="text"
                    name="periodValue"
                    id="periodValue"
                    value={formData.periodValue}
                    onChange={(e) => setFormData({ ...formData, periodValue: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    disabled={isSubmitting}
                    placeholder="2025 or 2025-Q2 or 2025-05"
                  />
                </div>

                <div>
                  <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">
                    目標値
                  </label>
                  <input
                    type="number"
                    name="targetValue"
                    id="targetValue"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        作成中...
                      </>
                    ) : (
                      '作成'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};