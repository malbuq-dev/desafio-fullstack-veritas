import { tasksApi, type TaskDTO } from "../../api/taskApi";
import type { Task } from "../types";

function fromDTO(dto: TaskDTO): Task {
  return {
    id: dto.ID,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    createdAt: new Date(dto.CreatedAt),
    updatedAt: new Date(dto.UpdatedAt),
  };
}

function toUpdateDTO(task: Partial<Task>): any {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
  };
}

export const taskRepository = {
  async getAll(): Promise<Task[]> {
    const dtos = await tasksApi.getAll();
    return dtos.map(fromDTO);
  },

  async getById(id: number): Promise<Task> {
    const dto = await tasksApi.getById(id.toString());
    return fromDTO(dto);
  },

  async create(task: Partial<Task>): Promise<Task> {
    const dto = await tasksApi.create({
      title: task.title!,
      description: task.description,
      status: task.status ?? "pending",
    });
    return fromDTO(dto);
  },

  async update(task: Partial<Task>): Promise<Task> {
    const dto = await tasksApi.update(toUpdateDTO(task));
    return fromDTO(dto);
  },

  async delete(id: number): Promise<void> {
    await tasksApi.delete(id);
  },
};
