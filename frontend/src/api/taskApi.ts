import { apiClient } from "./apiClient";
import { ENDPOINTS } from "./endpoints";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface TaskDTO {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface TaskListResponse {
  data: TaskDTO[];
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export const tasksApi = {
  async getAll(): Promise<TaskDTO[]> {
    const { data } = await apiClient.get<TaskListResponse>(`${ENDPOINTS.TASKS}/`);
    return data.data; 
  },

  async getById(id: string): Promise<TaskDTO> {
    const { data } = await apiClient.get<{ data: TaskDTO }>(`${ENDPOINTS.TASKS}/${id}`);
    return data.data;
  },

  async create(task: { title: string; description?: string; status?: string }): Promise<TaskDTO> {
    const { data } = await apiClient.post<{ data: TaskDTO }>(`${ENDPOINTS.TASKS}/`, task);
    return data.data;
  },

  async update(task: { id: number; title?: string; description?: string; status?: string }): Promise<TaskDTO> {
    const { data } = await apiClient.put<{ data: TaskDTO }>(`${ENDPOINTS.TASKS}/${task.id}`, task);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.TASKS}/${id}`);
  },
};