import { useState } from "react";
import { Plus, Layout, Search, Calendar, X } from "lucide-react";
import { Task, TaskStatusOptions } from "./types/task";
import { TaskForm } from "./components/TaskForm";
import { useTaskStore } from "./store/useTaskStore";
import { TaskColumn as TaskColumnComponent } from "./components/TaskColumn";

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { tasks, addTask, updateTask } = useTaskStore();

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmitTask = (taskData: Task) => {
    console.log("taskData", taskData);
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    handleCloseForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Layout className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Task Board
            </h1>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Plus size={20} className="mr-2" />
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TaskStatusOptions.map((column) => (
            <TaskColumnComponent
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onEditTask={handleEditTask}
            />
          ))}
        </div>

        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseForm}
            submit={handleSubmitTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;
