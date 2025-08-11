import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Clock,
  MoreVertical,
  Sparkles,
  GripVertical,
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Flag,
  Tag
} from 'lucide-react';

interface SortableTaskCardProps {
  task: any;
  onTaskClick: (taskId: string) => void;
}

export function SortableTaskCard({ task, onTaskClick }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return 'border-l-4 border-yellow-500';
      case 'in_progress': return 'border-l-4 border-blue-500';
      case 'review': return 'border-l-4 border-purple-500';
      case 'done': return 'border-l-4 border-green-500';
      default: return '';
    }
  };

  // クリックハンドラー：ドラッグ操作と区別するため
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTaskClick(task.id);
  };

  // メニューボタンのクリックハンドラー
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // メニュー処理
  };

  // ドラッグハンドルのマウスダウンハンドラー
  const handleDragMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 期限の状態を判定
  const getDueDateStatus = () => {
    if (!task.due_date) return null;
    const now = new Date();
    const dueDate = new Date(task.due_date);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays <= 2) return 'soon';
    return 'normal';
  };

  const dueDateStatus = getDueDateStatus();

  // サブタスクの完了率計算
  const getSubtaskProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) return null;
    const completed = task.subtasks.filter((st: any) => st.completed).length;
    return { completed, total: task.subtasks.length };
  };

  const subtaskProgress = getSubtaskProgress();

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer ${getStatusColor(task.status)} ${
        isDragging ? 'shadow-2xl ring-2 ring-blue-400' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="space-y-3">
        {/* ヘッダー部分 */}
        <div className="flex items-start gap-2">
          {/* ドラッグハンドル */}
          <div
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab hover:text-gray-600 flex-shrink-0"
            onMouseDown={handleDragMouseDown}
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
                {task.title}
              </h4>
              <button 
                className="text-gray-400 hover:text-gray-500 flex-shrink-0 ml-2"
                onClick={handleMenuClick}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            
            {task.description && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-4">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* タグ・ラベル */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag: any, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag.name}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* 進捗とサブタスク */}
        {subtaskProgress && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">サブタスク</span>
              <span className="text-gray-500">
                {subtaskProgress.completed}/{subtaskProgress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(subtaskProgress.completed / subtaskProgress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* AI生成タグと優先度 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.ai_generated && (
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-purple-600">AI</span>
              </div>
            )}
            
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              <Flag className="h-2.5 w-2.5 mr-1" />
              {task.priority === 'urgent' ? '緊急' :
               task.priority === 'high' ? '高' :
               task.priority === 'medium' ? '中' : '低'}
            </span>
          </div>

          {/* アクション数 */}
          <div className="flex items-center gap-2 text-gray-400">
            {task.comments_count > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span className="text-xs">{task.comments_count}</span>
              </div>
            )}
            {task.attachments_count > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span className="text-xs">{task.attachments_count}</span>
              </div>
            )}
          </div>
        </div>

        {/* プロジェクトと担当者 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {task.projects && (
              <span className="text-xs text-gray-500 truncate flex items-center gap-1">
                <CheckSquare className="h-3 w-3 flex-shrink-0" />
                {task.projects.title}
              </span>
            )}
          </div>
          
          {/* 担当者アバター */}
          {task.assignee && (
            <div className="flex items-center gap-1">
              {task.assignee.avatar_url ? (
                <img 
                  src={task.assignee.avatar_url} 
                  alt={task.assignee.name}
                  className="h-6 w-6 rounded-full border border-gray-200"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 期限 */}
        {task.due_date && (
          <div className={`flex items-center text-xs ${
            dueDateStatus === 'overdue' ? 'text-red-600' :
            dueDateStatus === 'today' ? 'text-orange-600' :
            dueDateStatus === 'soon' ? 'text-yellow-600' :
            'text-gray-500'
          }`}>
            <Calendar className="mr-1 h-3 w-3" />
            期限: {new Date(task.due_date).toLocaleDateString('ja-JP')}
            {dueDateStatus === 'overdue' && (
              <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                期限切れ
              </span>
            )}
          </div>
        )}

        {/* 時間追跡 */}
        {task.estimated_hours && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              見積: {task.estimated_hours}h
            </div>
            {task.actual_hours && (
              <div>実績: {task.actual_hours}h</div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}