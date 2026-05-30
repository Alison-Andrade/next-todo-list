import { addTodo, deleteTodo, toggleTodo } from "@/app/lib/actions";
import { db } from "@/app/lib/db";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const currentList = await db.todoList.findUnique({
    where: { id },
    include: {
      todos: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!currentList) {
    notFound();
  }

  const addTodoWithId = addTodo.bind(null, currentList.id);

  return (
    <main className="dark:bg-gray-900 h-screen w-full flex justify-center py-12 md:p-4 overflow-hidden">
      <div className="w-full max-w-md max-h-[95vh] bg-white dark:bg-gray-900 md:dark:bg-gray-800 rounded-lg md:shadow-md text-gray-800 dark:text-gray-200 p-6 flex flex-col">
        <div className="mb-4">
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            ← Voltar para as listas
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-200 border-b pb-2">
          {currentList.title}
        </h1>

        <form action={addTodoWithId} className="flex gap-2 mb-6">
          <input
            type="text"
            name="title"
            placeholder="Nova tarefa"
            className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:text-gray-800"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
          >
            +
          </button>
        </form>

        <ul className="space-y-3 overflow-y-auto custom-scrollbar">
          {currentList.todos.length === 0 && (
            <p className="text-gray-500 dark:text-gray-200 text-center py-4">
              Nenhuma tarefa adicionada ainda
            </p>
          )}
          {currentList.todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 border border-gray-600 rounded bg-gray-50 dark:bg-gray-800 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isDone"
                  checked={todo.isDone}
                  onChange={async () => {
                    "use server";
                    await toggleTodo(todo.id, !todo.isDone, currentList.id);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span
                  className={`text-gray-800 dark:text-gray-200 ${todo.isDone ? "line-through" : ""}`}
                >
                  {todo.title}
                </span>
              </div>

              <form
                action={async () => {
                  "use server";
                  await deleteTodo(todo.id, currentList.id);
                }}
              >
                <button
                  type="submit"
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
