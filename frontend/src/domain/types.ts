export type TaskStatus = "in_progress" | "completed" | "pending";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}