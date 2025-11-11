import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../../../domain/types";
import { Trash2, Edit3 } from "lucide-react";
import TaskFormModal from "./TaskFormModal";

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onUpdate: (data: { title: string; description?: string }) => void;
}

export default function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const [isEditing, setIsEditing] = useState(false);

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    setIsEditing(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md cursor-grab relative"
      >
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800">{task.title}</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleEditClick}
              className="text-gray-400 hover:text-blue-500 transition"
              aria-label="Edit task"
            >
              <Edit3 size={16} />
            </button>

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-gray-500 text-sm mt-1">{task.description}</p>
        )}
      </div>

      <TaskFormModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={(data) => onUpdate(data)}
        mode="edit"
        initialData={{
          title: task.title,
          description: task.description,
        }}
      />
    </>
  );
}
