import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Target
} from 'lucide-react';

// ダッシュボードから新規事業立案フローを削除し、純粋なダッシュボード機能に集中

export const Dashboard: React.FC = () => {
  // モックデータ
  const stats = {
    revenue: 2500000,
    revenueGrowth: 8.3,
    conversionRate: 35,
    conversionGrowth: 2.5,
    customerSatisfaction: 4.2,
    satisfactionChange: -0.3,
  };

  const recentProjects = [
    { id: 1, name: 'AIプラットフォーム開発', progress: 65 },
    { id: 2, name: 'マーケットリサーチ', progress: 80 },
    { id: 3, name: 'ユーザーインタビュー分析', progress: 45 },
  ];

  const todaysTasks = [
    { id: 1, title: '競合分析レポート作成', priority: 'high', completed: false },
    { id: 2, title: 'ユーザーインタビュー実施', priority: 'medium', completed: true },
    { id: 3, title: 'プロトタイプ要件定義', priority: 'high', completed: false },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600">今日のフォーカスと全体の進捗を確認できます</p>
      </div>

      {/* 主要KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均取引額</p>
              <p className="text-2xl font-bold text-gray-900">¥{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+{stats.revenueGrowth}%</span>
            <span className="text-sm text-gray-500 ml-2">先月比</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">商談成約率</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+{stats.conversionGrowth}%</span>
            <span className="text-sm text-gray-500 ml-2">先月比</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">顧客満足度</p>
              <p className="text-2xl font-bold text-gray-900">{stats.customerSatisfaction}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600 font-medium">{stats.satisfactionChange}</span>
            <span className="text-sm text-gray-500 ml-2">先月比</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 今日のタスク */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">今日のフォーカス</h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.priority === 'high' ? '高' : '中'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            すべてのタスクを表示 →
          </button>
        </div>

        {/* プロジェクト進捗 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">プロジェクト進捗</h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{project.name}</span>
                  <span className="text-sm text-gray-500">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            すべてのプロジェクトを表示 →
          </button>
        </div>
      </div>

      {/* KPI サマリー */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">今週のKPI進捗</h3>
          <Target className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">8</p>
            <p className="text-sm text-gray-600">ユーザーインタビュー</p>
            <p className="text-xs text-gray-500">目標: 10件</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-sm text-gray-600">プロトタイプ作成</p>
            <p className="text-xs text-gray-500">目標: 3個</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">45</p>
            <p className="text-sm text-gray-600">テストユーザー数</p>
            <p className="text-xs text-gray-500">目標: 50人</p>
          </div>
        </div>
      </div>
    </div>
  );
};