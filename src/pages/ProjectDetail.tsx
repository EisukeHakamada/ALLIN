import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, CheckSquare, Calendar, User, BarChart3, Target, BookOpen, CheckCircle, Lock, Play } from 'lucide-react';
import { useProjectDetail, useProjectKpis, useProjectTasks } from '../lib/api/hooks';
import { StrategyHub } from './StrategyHub';
import { generateRoadmap, getStageStatusColor, getPhaseDisplayName } from '../lib/roadmapGenerator';

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'tasks'>('overview');

  // プロジェクト詳細データを取得
  const { 
    data: project, 
    isLoading: isLoadingProject, 
    error: projectError 
  } = useProjectDetail(projectId || '');

  // プロジェクトのKPIデータを取得（エラーハンドリング追加）
  const { 
    data: kpis = [], 
    isLoading: isLoadingKpis, 
    error: kpisError 
  } = useProjectKpis(projectId || '');

  // プロジェクトのタスクデータを取得
  const { 
    data: tasks = [], 
    isLoading: isLoadingTasks, 
    error: tasksError 
  } = useProjectTasks(projectId || '');

  // KPIエラーは警告として扱い、処理を続行
  if (kpisError) {
    console.warn('KPI読み込みエラー（継続処理）:', kpisError);
  }

  // タスクエラーは警告として扱い、処理を続行
  if (tasksError) {
    console.warn('タスク読み込みエラー（継続処理）:', tasksError);
  }

  // ローディング状態（KPIエラーは無視）
  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">プロジェクト詳細を読み込み中...</span>
        </div>
      </div>
    );
  }

  // エラー状態（プロジェクトエラーのみ）
  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>プロジェクト一覧に戻る</span>
          </button>
          
          <div className="bg-white p-8 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">プロジェクトの読み込みに失敗しました</h3>
                <p className="text-sm text-red-500 mt-1">
                  {projectError?.message || 'プロジェクトが見つかりません'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // リーンキャンバスデータを戦略ハブ用に変換
  const leanCanvasData = project.lean_canvas ? {
    problemStatement: project.lean_canvas.problemStatement || '',
    solution: project.lean_canvas.solution || '',
    uniqueValueProposition: project.lean_canvas.uniqueValueProposition || '',
    unfairAdvantage: project.lean_canvas.unfairAdvantage || '',
    customerSegments: project.lean_canvas.customerSegments || '',
    keyMetrics: project.lean_canvas.keyMetrics || '',
    channels: project.lean_canvas.channels || '',
    costStructure: project.lean_canvas.costStructure || '',
    revenueStreams: project.lean_canvas.revenueStreams || ''
  } : {
    problemStatement: '',
    solution: '',
    uniqueValueProposition: '',
    unfairAdvantage: '',
    customerSegments: '',
    keyMetrics: '',
    channels: '',
    costStructure: '',
    revenueStreams: ''
  };

  // KPIデータを戦略ハブ用に変換（プロジェクトのkpisフィールドも確認）
  const projectKpis = project.kpis || [];
  const externalKpis = kpis || [];
  
  // プロジェクト保存時のKPIを優先し、外部KPIで補完
  const kpiData = projectKpis.length > 0 
    ? projectKpis.map((kpi, index) => ({
        id: kpi.id || `project-kpi-${index}`,
        name: kpi.name,
        target: kpi.target,
        description: kpi.description || '',
        selected: true // プロジェクト保存時のKPIは全て選択状態
      }))
    : externalKpis.map((kpi, index) => ({
        id: kpi.id || `external-kpi-${index}`,
        name: kpi.name,
        target: kpi.target,
        description: kpi.description || '',
        selected: true
      }));

  // 戦略ハブ用の初期データを構築
  const initialStrategyData = {
    projectId: project.id,
    title: project.title,
    description: project.description || '',
    leanCanvasData,
    kpiData
  };

  // タスクのステータス別集計
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    review: tasks.filter(task => task.status === 'review').length,
    done: tasks.filter(task => task.status === 'done').length
  };

  // ロードマップ生成
  const roadmapStages = generateRoadmap(project.business_phase, project.progress);

  // 重要KPIを抽出（最大3つ）
  const topKpis = projectKpis.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return 'ToDo';
      case 'in_progress':
        return '進行中';
      case 'review':
        return 'レビュー';
      case 'done':
        return '完了';
      default:
        return '不明';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  // タブの定義
  const tabs = [
    { id: 'overview' as const, name: '概要', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'strategy' as const, name: '戦略', icon: <Target className="w-5 h-5" /> },
    { id: 'tasks' as const, name: 'タスク', icon: <CheckSquare className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ページヘッダー */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>プロジェクト一覧に戻る</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === 'active' ? '進行中' :
                   project.status === 'completed' ? '完了' :
                   project.status === 'on_hold' ? '保留' : '計画中'}
                </span>
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                  project.business_phase === 'PSF' ? 'bg-orange-100 text-orange-700' :
                  project.business_phase === 'PMF' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {getPhaseDisplayName(project.business_phase)}
                </span>
                <span className="text-sm text-gray-600">
                  進捗: {project.progress}%
                </span>
              </div>
            </div>

            {/* 統計情報 */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
                <div className="text-xs text-gray-600">総タスク</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
                <div className="text-xs text-gray-600">進行中</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
                <div className="text-xs text-gray-600">完了</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="max-w-7xl mx-auto p-6">
        {/* 概要タブ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI概要 */}
            {topKpis.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">重要KPI</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topKpis.map((kpi, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">{kpi.name}</h4>
                      <p className="text-2xl font-bold text-blue-600">{kpi.target}</p>
                      {kpi.description && (
                        <p className="text-sm text-gray-600 mt-1">{kpi.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ロードマップ */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg shadow-sm border p-8 relative overflow-hidden">
              {/* 背景の微細なパターン */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle, #64748b 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold text-slate-800 font-dotgothic">
                    📍 {getPhaseDisplayName(project.business_phase)} ロードマップ
                  </h3>
                  <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-600 font-dotgothic text-sm">
                      進捗率: {project.progress}%
                    </span>
                  </div>
                </div>

                {/* ワールドマップ風ロードマップ */}
                <div className="relative">
                  {/* ステージ配置 */}
                  <div className="flex justify-between items-center relative">
                    {roadmapStages.map((stage, index) => {
                      const isCompleted = stage.status === 'completed';
                      const isCurrent = stage.status === 'current';
                      const isLocked = stage.status === 'locked';
                      
                      return (
                        <div key={stage.id} className="relative group">
                          {/* 道のパス（次のステージへの線） */}
                          {index < roadmapStages.length - 1 && (
                            <div 
                              className={`absolute top-1/2 left-full w-20 h-1 -mt-0.5 z-0 rounded-full ${
                                isCompleted ? 'bg-emerald-400' : 'bg-slate-300'
                              }`}
                              style={{
                                backgroundImage: isCompleted 
                                  ? 'linear-gradient(90deg, #34d399, #10b981)'
                                  : 'linear-gradient(90deg, #cbd5e1, #94a3b8)'
                              }}
                            />
                          )}
                          
                          {/* ステージアイコン */}
                          <div className="relative">
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl cursor-pointer relative z-10 transition-all duration-300 border-3 ${
                                isCompleted
                                  ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-400 shadow-lg text-emerald-700'
                                  : isCurrent
                                  ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 shadow-lg text-blue-700 ring-4 ring-blue-200 ring-opacity-50'
                                  : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 shadow-sm text-slate-500'
                              } hover:scale-110 hover:shadow-lg`}
                            >
                              {stage.icon}
                            </div>
                            
                            {/* 現在地プレイヤーキャラクター */}
                            {isCurrent && (
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                                <div className="text-lg">⭐</div>
                              </div>
                            )}
                            
                            {/* 完了マーク */}
                            {isCompleted && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          
                          {/* ステージ名 */}
                          <div className="mt-3 text-center">
                            <h4 className={`font-dotgothic text-xs font-medium ${
                              isCompleted ? 'text-emerald-700' : 
                              isCurrent ? 'text-blue-700' : 
                              'text-slate-500'
                            }`}>
                              {stage.name}
                            </h4>
                          </div>
                          
                          {/* ホバー時のメッセージウィンドウ */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-4 min-w-64">
                              <div className="text-slate-700">
                                <h5 className="font-semibold text-slate-800 mb-2 font-dotgothic">
                                  {stage.icon} {stage.name}
                                </h5>
                                <p className="text-sm mb-3 leading-relaxed text-slate-600">
                                  {stage.description}
                                </p>
                                
                                {stage.kpis && stage.kpis.length > 0 && (
                                  <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">
                                      📊 重要指標:
                                    </p>
                                    <div className="text-xs space-y-1">
                                      {stage.kpis.map((kpi, kpiIndex) => (
                                        <div key={kpiIndex} className="text-slate-600 bg-slate-50 px-2 py-1 rounded">
                                          • {kpi}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* 吹き出しの矢印 */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
                                <div className="w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-slate-100 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* レジェンド */}
                <div className="mt-8 flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-200 border border-emerald-400 rounded-full"></div>
                    <span className="text-slate-600 font-dotgothic text-sm">完了</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded-full ring-2 ring-blue-200 ring-opacity-50"></div>
                    <span className="text-slate-600 font-dotgothic text-sm">進行中</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-200 border border-slate-300 rounded-full"></div>
                    <span className="text-slate-600 font-dotgothic text-sm">未着手</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 戦略タブ */}
        {activeTab === 'strategy' && (
          <StrategyHub 
            mode="view" 
            initialData={initialStrategyData}
          />
        )}

        {/* タスクタブ */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckSquare className="w-5 h-5 mr-2" />
                    タスク一覧
                  </h3>
                  <span className="text-sm text-gray-600">
                    {taskStats.done}/{taskStats.total} 完了
                  </span>
                </div>
              </div>

              <div className="p-6">
                {isLoadingTasks ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">読み込み中...</span>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">タスクがありません</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {getStatusText(task.status)}
                              </span>
                              {task.priority && (
                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority === 'urgent' ? '緊急' :
                                   task.priority === 'high' ? '高' :
                                   task.priority === 'medium' ? '中' : '低'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* タスク詳細情報 */}
                        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                          {task.due_date && (
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(task.due_date)}</span>
                            </div>
                          )}
                          {task.estimated_hours && (
                            <div className="flex items-center">
                              <span>見積: {task.estimated_hours}h</span>
                            </div>
                          )}
                          {task.ai_generated && (
                            <div className="text-blue-500">
                              <span>AI生成</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};