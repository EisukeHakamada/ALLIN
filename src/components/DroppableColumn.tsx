import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskCard } from './SortableTaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: any[];
  onTaskClick: (taskId: string) => void;
}

export function DroppableColumn({ id, title, tasks, onTaskClick }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const getStatusColor = (statusId: string) => {
    switch(statusId) {
      case 'todo': return 'bg-yellow-50 border-yellow-200';
      case 'in_progress': return 'bg-blue-50 border-blue-200';
      case 'review': return 'bg-purple-50 border-purple-200';
      case 'done': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getHeaderColor = (statusId: string) => {
    switch(statusId) {
      case 'todo': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`rounded-xl shadow-sm border-2 transition-colors duration-200 ${
      isOver ? 'border-blue-400 shadow-md' : getStatusColor(id)
    } overflow-hidden`}>
      {/* カラムヘッダー */}
      <div className={`px-4 py-3 border-b ${getHeaderColor(id)}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span>{title}</span>
            <span className="bg-white bg-opacity-70 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {tasks.length}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
              title="タスクを追加"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
              title="オプション"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* タスクドロップゾーン */}
      <div
        ref={setNodeRef}
        className={`p-3 min-h-[500px] transition-all duration-200 ${
          isOver ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <SortableTaskCard 
                key={task.id} 
                task={task} 
                onTaskClick={onTaskClick}
              />
            ))}
            
            {/* 空の状態 */}
            {tasks.length === 0 && (
              <div className={`text-center py-8 rounded-lg border-2 border-dashed transition-colors ${
                isOver ? 'border-blue-300 bg-blue-25' : 'border-gray-200'
              }`}>
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {isOver ? 'ここにドロップ' : 'タスクなし'}
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}