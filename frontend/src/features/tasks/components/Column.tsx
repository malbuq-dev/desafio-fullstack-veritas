import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import TaskFormModal from "./TaskFormModal";
import type { Task, TaskStatus } from "../../../domain/types";

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onCreate: (data: Partial<Task>) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, status: TaskStatus) => void;
  onUpdate: (taskId: number, data: { title: string; description?: string }) => void;
}

export default function Column({
  id,
  title,
  tasks,
  onCreate,
  onDelete,
  onUpdate,
}: ColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (data: { title: string; description?: string }) => {
    onCreate({ ...data, status: id });
  };

  const { setNodeRef, isOver } = useDroppable({
    id, 
  });

  return (
    <div className="bg-gray-50 rounded-lg shadow p-4 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">{title}</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          +
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[200px] rounded-md border border-dashed p-1 transition-colors
          ${isOver ? "bg-blue-50 border-blue-400" : "border-transparent"}`}
      >
        {tasks.map((task) => (
            <TaskCard
            key={task.id}
            task={task}
            onDelete={() => onDelete(task.id)}
            onUpdate={(data) => onUpdate(task.id, data)}
            />
        ))}
      </div>

    <TaskFormModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleCreate}
    mode="create"
    />
    </div>
  );
}
