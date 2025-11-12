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
      <div className="bg-primary text-textPrimary rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-textSecondary">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-accent focus:outline-none bg-bg text-textPrimary"
              placeholder="Título da tarefa"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textSecondary">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md px-3 py-2 focus:ring-2 focus:ring-accent focus:outline-none bg-bg text-textPrimary"
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-second text-bg rounded-md hover:opacity-90"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-accent text-bg rounded-md hover:opacity-90"
            >
              {isEdit ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
