import { useQuery } from "@tanstack/react-query";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

async function fetchTodos(): Promise<Todo[]> {
  const endpoint = "https://jsonplaceholder.typicode.com/todos/";

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const todos = await response.json();
  return todos.slice(0, 9); // Limit to 10 todos for demonstration
}

export function useTodos() {
  const { data: todos = [], isLoading: todosLoading } = useQuery<Todo[]>({
    queryFn: () => fetchTodos(),
    queryKey: ["todos"],
  });

  return {
    todos,
    todosLoading,
  };
}
