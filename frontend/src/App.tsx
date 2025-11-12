import KanbanBoard from "./features/tasks/components/KanbanBoard";
import { useTasksViewModel } from "./features/tasks/hooks/useTasksViewModel";
import VeritasLogo from "../assets/veritas-kanban.png";

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
    <div className="min-h-screen bg-bg font-sans">
    <header className="bg-second/10 text-textPrimary p-4 text-xl font-semibold shadow border-second flex justify-center items-center">
      <img
        src={VeritasLogo}
        alt="Veritas Kanban"
        className="max-h-full h-[3rem] w-auto"
      />
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
