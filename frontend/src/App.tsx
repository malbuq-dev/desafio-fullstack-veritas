import React from "react";
import KanbanBoard from "./features/tasks/components/KanbanBoard";
import { useTasksViewModel } from "./features/tasks/hooks/useTasksViewModel";

export default function App() {
  const {
    groupedTasks,
    createTask,
    deleteTask,
    moveTask,
    editTask,
    isLoading,
  } = useTasksViewModel();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-xl font-semibold shadow">
        Kanban Board
      </header>
      <KanbanBoard
        groupedTasks={groupedTasks}
        onCreate={createTask.mutate}
        onDelete={deleteTask.mutate}
        onMove={moveTask}
        onUpdate={editTask}   
        isLoading={isLoading}
      />
    </div>
  );
}
