import React, { useState } from 'react';
import { Plus, Folder, Calendar, Users, Lightbulb, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { NewProjectModal } from '../components/NewProjectModal';
import { useProjects } from '../lib/api/hooks';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Supabaseからプロジェクト一覧を取得
  const { 
    data: projects = [], 
    isLoading: isLoadingProjects, 
    error: projectsError 
  } = useProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '進行中';
      case 'completed':
        return '完了';
      case 'on-hold':
        return '保留';
      default:
        return '不明';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  // 事業フェーズのバッジ色を決定
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'PSF':
        return 'bg-orange-100 text-orange-700';
      case 'PMF':
        return 'bg-blue-100 text-blue-700';
      case 'Scale':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'PSF':
        return 'PSF検証';
      case 'PMF':
        return 'PMF検証';
      case 'Scale':
        return 'スケール';
      default:
        return phase;
    }
  };

  // プロジェクト一覧読み込み中
  if (isLoadingProjects) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">プロジェクトを読み込み中...</span>
        </div>
      </div>
    );
  }

  // プロジェクト一覧読み込みエラー
  if (projectsError) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">プロジェクト読み込みエラー</p>
            <p className="text-red-700 text-sm">
              {projectsError instanceof Error ? projectsError.message : 'プロジェクトの読み込みに失敗しました'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プロジェクト</h1>
          <p className="text-gray-600 mt-1">
            進行中のプロジェクトを管理し、新しい事業アイデアを立案できます。
          </p>
        </div>
        
        <div className="flex space-x-3">
          {/* 新規事業立案ボタン（戦略ハブへの遷移） */}
          <button
            onClick={() => navigate('/strategy-hub')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Lightbulb className="w-5 h-5" />
            <span className="font-medium">+ 新規事業を立案する</span>
          </button>
          
          {/* 通常のプロジェクト作成ボタン */}
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            disabled={isLoadingProjects}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>プロジェクト作成</span>
          </button>
        </div>
      </div>

      {/* プロジェクト一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Folder className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title || project.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    {/* 事業フェーズバッジを追加 */}
                    {project.business_phase && (
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPhaseColor(project.business_phase)}`}>
                        {getPhaseText(project.business_phase)}
                      </span>
                    )}
                    {/* 優先度がurgentの場合は特別表示 */}
                    {project.priority === 'urgent' && (
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        緊急
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {project.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
            )}

            <div className="space-y-3">
              {project.progress !== undefined && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>進捗</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        project.business_phase === 'PSF' ? 'bg-orange-600' : 
                        project.business_phase === 'PMF' ? 'bg-blue-600' : 
                        project.business_phase === 'Scale' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                {(project.deadline || project.due_date) && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.deadline || project.due_date)}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>1人</span>
                </div>
              </div>

              {/* 作成日を表示 */}
              {project.created_at && (
                <div className="text-xs text-gray-500">
                  作成日: {formatDate(project.created_at)}
                </div>
              )}
            </div>
          </Link>
        ))}

        {/* 空の状態 */}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              プロジェクトがありません
            </h3>
            <p className="text-gray-600 mb-6">
              最初のプロジェクトを作成して、事業を開始しましょう。
            </p>
            <button
              onClick={() => navigate('/strategy-hub')}
              disabled={isLoadingProjects}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lightbulb className="w-5 h-5" />
              <span>新規事業を立案する</span>
            </button>
          </div>
        )}
      </div>

      {/* モーダル */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
};  