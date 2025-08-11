import React from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  Brain,
  Calendar,
  ArrowRight,
  Plus
} from 'lucide-react';

export function Dashboard() {
  // ダミーデータ（後でSupabaseから取得）
  const todayFocus = [
    {
      id: 1,
      title: 'プロジェクトA: 顧客インタビュー実施',
      project: 'ECサイト改善',
      deadline: '今日',
      priority: 'urgent',
      phase: 'PSF'
    },
    {
      id: 2,
      title: 'プロジェクトB: MVP機能確認レビュー',
      project: '新SaaS事業',
      deadline: '今日',
      priority: 'high',
      phase: 'PMF'
    },
    {
      id: 3,
      title: 'プロジェクトC: 売上分析レポート作成',
      project: 'マーケティング自動化',
      deadline: '明日',
      priority: 'medium',
      phase: 'Scale'
    }
  ];

  const recentWork = [
    { id: 1, action: 'プロジェクトA: タスク完了', time: '5分前', type: 'task' },
    { id: 2, action: 'クライアントBから返信あり', time: '15分前', type: 'message' },
    { id: 3, action: 'プロジェクトC: フェーズ進行可能', time: '30分前', type: 'phase' },
    { id: 4, action: 'AI提案: 次週の優先タスク確認', time: '1時間前', type: 'ai' }
  ];

  const activeProjects = [
    {
      id: 1,
      name: 'ECサイト改善',
      phase: 'PSF段階',
      progress: 65,
      status: 'active'
    },
    {
      id: 2,
      name: '新SaaS事業',
      phase: 'PMF段階',
      progress: 80,
      status: 'active'
    },
    {
      id: 3,
      name: 'マーケティング自動化',
      phase: 'Scale段階',
      progress: 45,
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 今日のフォーカス */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">今日のフォーカス</h2>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            AIに相談する <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {todayFocus.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.priority === 'urgent' ? 'bg-red-500' :
                  item.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.project} • {item.phase}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  item.deadline === '今日' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  期限: {item.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">23</div>
          <div className="text-sm text-gray-600">完了したタスク</div>
          <div className="text-xs text-green-600 mt-1">+3 今日</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">15</div>
          <div className="text-sm text-gray-600">進行中タスク</div>
          <div className="text-xs text-blue-600 mt-1">期限注意</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-600">未着手タスク</div>
          <div className="text-xs text-red-600 mt-1">緊急 2件</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <FolderOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">10</div>
          <div className="text-sm text-gray-600">アクティブプロジェクト</div>
          <div className="text-xs text-purple-600 mt-1">PMF段階</div>
        </div>
      </div>

      {/* 下部セクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近の仕事 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近の仕事</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">すべて表示</button>
          </div>
          
          {recentWork.length > 0 ? (
            <div className="space-y-3">
              {recentWork.map((work) => (
                <div key={work.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    work.type === 'task' ? 'bg-green-500' :
                    work.type === 'message' ? 'bg-blue-500' :
                    work.type === 'phase' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{work.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{work.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">まだタスクはありません</p>
            </div>
          )}
        </div>

        {/* アクティブプロジェクト */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">アクティブプロジェクト</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">すべて表示</button>
          </div>
          
          {activeProjects.length > 0 ? (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.phase}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">アクティブなプロジェクトはありません</p>
            </div>
          )}
        </div>
      </div>

      {/* フローティングボタン */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}