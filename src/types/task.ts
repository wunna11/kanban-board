export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface TaskColumn {
  id: TaskStatus,
  title: string
}