export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface TaskColumn {
  id: TaskStatus,
  title: string
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  startDate?: string | Date;
  endDate?: string | Date;
}


export const TaskStatusOptions: TaskColumn[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];