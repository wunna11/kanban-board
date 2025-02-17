import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { TaskColumn as TC, Task } from "../types/task";

interface TaskColumnProps {
  column: TC;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export function TaskColumn({ column, tasks, onEditTask }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "from-pink-50 to-rose-50 border-pink-100";
      case "in-progress":
        return "from-blue-50 to-indigo-50 border-blue-100";
      case "done":
        return "from-green-50 to-emerald-50 border-green-100";
      default:
        return "from-gray-50 to-gray-100 border-gray-100";
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-xl bg-gradient-to-b ${getColumnColor(
        column.id
      )} border p-4 shadow-sm`}
    >
      <h2 className="font-semibold text-gray-800 mb-4 px-2">{column.title}</h2>
      <div ref={setNodeRef} className="flex-1 space-y-3">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-sm text-gray-400 text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
