import React from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { Task, TaskStatus } from "../../../domain/types";
import Column from "./Column";

interface KanbanBoardProps {
  groupedTasks: Record<TaskStatus, Task[]>;
  onMove: (taskId: number, newStatus: TaskStatus) => void;
  onCreate: (task: Partial<Task>) => void;
  onDelete: (taskId: number) => void;
  onUpdate: (taskId: number, data: { title: string; description?: string }) => void;
  isLoading?: boolean;
}


const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function KanbanBoard({
  groupedTasks,
  onMove,
  onCreate,
  onDelete,
  onUpdate,
  isLoading = false,
}: KanbanBoardProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as TaskStatus;

    const alreadyInColumn = Object.entries(groupedTasks).some(
      ([status, tasks]) =>
        status === newStatus &&
        tasks.some((task) => task.id === taskId)
    );
    if (alreadyInColumn) return;

    onMove(taskId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400">
        Loading tasks...
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-6 p-6 bg-gray-100 min-h-[80vh]">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
        <Column
          key={status}
          id={status as TaskStatus}
          title={STATUS_LABELS[status as TaskStatus]}
          tasks={tasks}
          onCreate={onCreate}
          onDelete={onDelete}
          onMove={onMove}
          onUpdate={onUpdate}
        />
        ))}
      </div>
    </DndContext>
  );
}
