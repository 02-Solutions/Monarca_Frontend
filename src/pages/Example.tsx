import Layout from "../components/Layout";
import { useTodos } from "../hooks/example/useTodos";

import { ToastContainer, toast } from "react-toastify";

function Example() {
  const { todos, todosLoading } = useTodos();

  const notify = () => toast("Prueba");

  return (
    <Layout>
      <div>
        <ToastContainer />
        <button
          onClick={notify}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 mb-8"
        >
          Probar Notificaciones
        </button>
      </div>
      {todosLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {todo.title}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {todo.completed ? "Completed ✅" : "Not completed ❌"}
              </p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Example;
