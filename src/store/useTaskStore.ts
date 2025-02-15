import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '../types/task';

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void
  updateTask: (id: string, task: Task) => void
  deleteTask: (id: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID()
            }
          ]
        }))
      },
      updateTask: (id, updates) => {
        set((state) => (
          {
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task)
          }))
      },
      deleteTask: (id: string) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }))
    }),
    {
      name: 'task-storage'
    }
  )
)