import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskRepository } from "../../../domain/repositories/taskRepository";
import type { Task, TaskStatus } from "../../../domain/types";

export function useTasksViewModel() {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskRepository.getAll,
  });

  const createTask = useMutation({
    mutationFn: taskRepository.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTask = useMutation({
    mutationFn: taskRepository.update,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(["tasks"], (old) =>
          old?.map((t) =>
            t.id === updatedTask.id ? { ...t, ...updatedTask } : t
          ) ?? []
        );
      }

      return { previousTasks };
    },
    onError: (_err, _newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: taskRepository.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const moveTask = async (taskId: number, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    await updateTask.mutateAsync({ ...task, status: newStatus });
  };

  const editTask = (taskId: number, data: { title: string; description?: string }) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateTask.mutate({
      ...task,
      title: data.title,
      description: data.description,
    });
  };

  const groupedTasks = {
    pending: tasks.filter((t) => t.status === "pending"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  return {
    tasks,
    groupedTasks,
    isLoading,
    isError,
    error,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    editTask,
  };
}
