import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  Target,
  ArrowUpRight,
  BarChart2
} from 'lucide-react';
import { HierarchySelector } from '../components/HierarchySelector';
import type { ScopeType } from '../lib/api/types';
import { useKPIs } from '../lib/api/hooks';
import { CreateKPIModal } from '../components/CreateKPIModal';

export const KPIManagement = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentScope, setCurrentScope] = useState({ type: 'organization' as ScopeType, id: 'org1' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Fetch all KPI data once
  const { data: allKPIs, isLoading, error } = useKPIs();

  // Filter KPIs based on current scope
  const kpis = allKPIs?.filter(kpi => 
    kpi.scope_type === currentScope.type && kpi.scope_id === currentScope.id
  );

  // Handle scope change
  const handleScopeChange = (type: ScopeType, id: string) => {
    setCurrentScope({ type, id });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'off_track': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down': return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <div className="h-5 w-5 border-t-2 border-gray-400" />;
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ja-JP').format(value);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">KPIデータを読み込んでいます</h3>
          <p className="mt-2 text-sm text-gray-500">
            しばらくお待ちください...
          </p>
        </div>
      </div>
    );
  }

  // Header section
  const renderHeader = () => (
    <>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">KPI管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            重要業績評価指標（KPI）の管理・モニタリング
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            KPI追加
          </button>
        </div>
      </div>

      {/* Create KPI Modal */}
      <CreateKPIModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        scope={currentScope}
      />

      {/* Scope selector */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <HierarchySelector onScopeChange={handleScopeChange} />
      </div>
    </>
  );

  // Error state with create button
  if (error) {
    return (
      <div>
        {renderHeader()}
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            データの読み込みに失敗しました
          </h3>
          <p className="text-gray-500 max-w-md mb-8">
            再度お試しください。問題が解決しない場合は、管理者にお問い合わせください。
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              再読み込み
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state with create options
  if (!kpis || kpis.length === 0) {
    return (
      <div>
        {renderHeader()}
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <BarChart2 className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            KPIがまだ設定されていません
          </h3>
          <p className="text-gray-500 max-w-md mb-8">
            組織の重要な指標を設定して、パフォーマンスを可視化・追跡しましょう。
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer"
                   onClick={() => setIsCreateModalOpen(true)}>
                <Target className="h-8 w-8 text-blue-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">KGI設定</h4>
                <p className="text-sm text-gray-500">
                  組織の重要目標指標を設定します
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer"
                   onClick={() => setIsCreateModalOpen(true)}>
                <ArrowUpRight className="h-8 w-8 text-green-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">KPI設定</h4>
                <p className="text-sm text-gray-500">
                  具体的な業績評価指標を設定します
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer"
                   onClick={() => setIsCreateModalOpen(true)}>
                <BarChart3 className="h-8 w-8 text-purple-500 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">目標設定</h4>
                <p className="text-sm text-gray-500">
                  数値目標と期限を設定します
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular view with data
  return (
    <div>
      {renderHeader()}

      {/* Search and filter section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="KPIを検索"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                フィルター
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </button>
              
              {filterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">カテゴリー</div>
                    <div className="max-h-48 overflow-y-auto">
                      {['すべて', '財務', '顧客', '業務プロセス', '成長と学習'].map((category) => (
                        <div key={category} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <input
                            id={`category-${category}`}
                            name={`category-${category}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`category-${category}`} className="ml-2 block text-sm text-gray-900">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KPI
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                現在値
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                目標値
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                進捗
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                トレンド
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">アクション</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {kpis.map((kpi) => (
              <tr key={kpi.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{kpi.name}</div>
                      <div className="text-sm text-gray-500">{kpi.scope_type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(kpi.current_value)}</div>
                  <div className="text-sm text-gray-500">{kpi.unit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(kpi.target_value)}</div>
                  <div className="text-sm text-gray-500">{kpi.unit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round((kpi.current_value / kpi.target_value) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            kpi.current_value >= kpi.target_value ? 'bg-green-500' :
                            kpi.current_value >= kpi.target_value * 0.8 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.round((kpi.current_value / kpi.target_value) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTrendIcon(kpi.current_value > kpi.target_value * 0.8 ? 'up' : 'down')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    kpi.current_value >= kpi.target_value ? getStatusColor('on_track') :
                    kpi.current_value >= kpi.target_value * 0.8 ? getStatusColor('at_risk') :
                    getStatusColor('off_track')
                  }`}>
                    {kpi.current_value >= kpi.target_value ? '達成' :
                     kpi.current_value >= kpi.target_value * 0.8 ? '要注意' :
                     '未達'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* KPI alerts */}
      {kpis && kpis.some(kpi => kpi.current_value < kpi.target_value * 0.8) && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">KPIアラート</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
            {kpis
              .filter(kpi => kpi.current_value < kpi.target_value * 0.8)
              .map(kpi => (
                <div key={`alert-${kpi.id}`} className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {kpi.name}の達成率が低下しています
                      </h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          現在値: {formatNumber(kpi.current_value)}{kpi.unit} (目標: {formatNumber(kpi.target_value)}{kpi.unit})
                        </p>
                      </div>
                      <div className="mt-3">
                        <div className="-mx-2 -my-1.5 flex">
                          <button
                            type="button"
                            className="bg-white px-2 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            詳細を確認
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};