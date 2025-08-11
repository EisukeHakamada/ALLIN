import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { api } from '../lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import type { ScopeType } from '../lib/api/types';

interface CreateKPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  scope: {
    type: ScopeType;
    id: string;
  };
}

export const CreateKPIModal: React.FC<CreateKPIModalProps> = ({ isOpen, onClose, scope }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetValue: '',
    unit: 'JPY',
    autoCollect: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!formData.name || !formData.targetValue) {
        throw new Error('名前と目標値は必須です');
      }

      const targetValue = parseFloat(formData.targetValue);
      if (isNaN(targetValue)) {
        throw new Error('目標値は有効な数値である必要があります');
      }

      await api.createKPI({
        scope_type: scope.type,
        scope_id: scope.id,
        name: formData.name,
        description: formData.description || null,
        target_value: targetValue,
        actual_value: 0,
        unit: formData.unit,
        auto_collect: formData.autoCollect
      });

      // Invalidate KPIs query to trigger a refetch
      await queryClient.invalidateQueries(['kpis']);

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        targetValue: '',
        unit: 'JPY',
        autoCollect: true
      });
      onClose();
    } catch (error) {
      console.error('Error creating KPI:', error);
      setError(error instanceof Error ? error.message : 'KPIの作成中にエラーが発生しました。もう一度お試しください。');
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
                新規KPI作成
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  新しいKPIを作成します。必要な情報を入力してください。
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
                  <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">
                    目標値
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="targetValue"
                      id="targetValue"
                      value={formData.targetValue}
                      onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                      className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-12 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">{formData.unit}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                    単位
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={isSubmitting}
                  >
                    <option value="JPY">円</option>
                    <option value="%">%</option>
                    <option value="件">件</option>
                    <option value="人">人</option>
                  </select>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="autoCollect"
                      name="autoCollect"
                      type="checkbox"
                      checked={formData.autoCollect}
                      onChange={(e) => setFormData({ ...formData, autoCollect: e.target.checked })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="autoCollect" className="font-medium text-gray-700">
                      自動収集を有効にする
                    </label>
                    <p className="text-gray-500">可能な場合、データを自動的に収集します</p>
                  </div>
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