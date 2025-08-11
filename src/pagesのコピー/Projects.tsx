import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { NewProjectModal } from '../components/NewProjectModal';
import { 
  Plus, 
  Filter, 
  Search, 
  MoreVertical, 
  ChevronDown,
  Users,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';

export function Projects() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('board');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // プロジェクト一覧取得
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // ビジネスフェーズの定義
  const businessPhases = {
    PSF: { label: 'PSF段階', color: 'bg-yellow-100 text-yellow-800', description: 'Problem-Solution Fit検証中' },
    PMF: { label: 'PMF段階', color: 'bg-blue-100 text-blue-800', description: 'Product-Market Fit検証中' },
    Scale: { label: 'Scale段階', color: 'bg-green-100 text-green-800', description: '事業拡大中' }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // AI提案のダミーデータ
  const aiSuggestions = [
    {
      id: 1,
      icon: Target,
      color: 'text-purple-600',
      message: 'プロジェクトA: PSF達成まであと2つの検証タスクが必要です'
    },
    {
      id: 2,
      icon: TrendingUp,
      color: 'text-green-600',
      message: 'プロジェクトB: PMFフェーズへの移行条件を満たしています'
    },
    {
      id: 3,
      icon: AlertCircle,
      color: 'text-red-600',
      message: 'プロジェクトC: 期限まで3日、重要タスクが未完了です'
    }
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">プロジェクト管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            ビジネスフェーズに応じた戦略的プロジェクト管理
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            新規プロジェクト
          </button>
        </div>
      </div>

      {/* AI提案セクション */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI提案</h3>
        </div>
        <div className="space-y-3">
          {aiSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-start gap-3">
              <suggestion.icon className={`h-5 w-5 ${suggestion.color} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700">{suggestion.message}</span>
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
                placeholder="プロジェクトを検索"
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
            
            <div className="inline-flex shadow-sm rounded-md">
              <button
                onClick={() => setViewMode('board')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  viewMode === 'board' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                ボード
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-r border-t border-b border-gray-300`}
              >
                リスト
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクト一覧 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : viewMode === 'board' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} businessPhases={businessPhases} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400">
                <Plus className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg">まだプロジェクトがありません</p>
                <p className="text-sm mt-1">新規プロジェクトを作成してください</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ProjectList projects={projects || []} businessPhases={businessPhases} />
      )}

      {/* 新規プロジェクトモーダル */}
      <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
      />
    </div>
  );
}

// プロジェクトカードコンポーネント
function ProjectCard({ project, businessPhases }: any) {
  const phase = businessPhases[project.business_phase || 'PSF'];
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{project.title}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">{project.description || 'プロジェクトの説明'}</p>
        
        {/* ビジネスフェーズ */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${phase.color}`}>
            {phase.label}
          </span>
          <p className="text-xs text-gray-500 mt-1">{phase.description}</p>
        </div>
        
        {/* 進捗 */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">進捗</span>
            <span className="text-xs font-medium text-gray-700">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>
        </div>
        
        {/* KPI（仮） */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">タスク完了率</span>
            <span className="flex items-center text-green-600">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              65%
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">期限遵守率</span>
            <span className="flex items-center text-yellow-600">
              <Clock className="h-4 w-4 mr-1" />
              80%
            </span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            詳細を見る
          </button>
        </div>
      </div>
    </div>
  );
}

// プロジェクトリストコンポーネント
function ProjectList({ projects, businessPhases }: any) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {projects.length > 0 ? (
          projects.map((project: any) => {
            const phase = businessPhases[project.business_phase || 'PSF'];
            
            return (
              <li key={project.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{project.title}</p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${phase.color}`}>
                        {phase.label}
                      </span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button className="p-1 text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Tag className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          project.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.priority === 'urgent' ? '緊急' :
                           project.priority === 'high' ? '高' :
                           project.priority === 'medium' ? '中' : '低'}
                        </span>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>期限: {project.deadline ? new Date(project.deadline).toLocaleDateString('ja-JP') : '未設定'}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">進捗</span>
                      <span className="text-xs font-medium text-gray-700">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="px-4 py-12 text-center">
            <Plus className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">プロジェクトがありません</p>
          </li>
        )}
      </ul>
    </div>
  );
}