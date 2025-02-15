import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { Task } from '../types/task';
import { useTaskStore } from '@/store/useTaskStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { deleteTask } = useTaskStore();

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
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-200 ${
        isDragging ? 'rotate-2 shadow-lg' : ''
      } hover:shadow-md`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-gray-900 flex-1">{task.title}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-500 p-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
            </button>
            <div
              {...listeners}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-50 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={14} />
            </div>
          </div>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 mt-2">{task.description}</p>
        )}
      </div>
    </div>
  );
}