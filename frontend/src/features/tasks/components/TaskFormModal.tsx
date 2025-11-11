import React, { useEffect, useState } from "react";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => void;
  mode?: "create" | "edit";
  initialData?: { title: string; description?: string };
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title ?? "");
      setDescription(initialData?.description ?? "");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description });
    onClose();
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Task" : "Create New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
