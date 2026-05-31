import Link from "next/link";
import { db } from "../lib/db";
import { createList, deleteList } from "../lib/actions";
import { auth } from "@/auth";

export default async function MinhasListas() {
  const session = await auth();

  const lists = await db.todoList.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          todos: true,
        },
      },
    },
  });

  console.log(lists);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 md:dark:bg-gray-800 rounded-lg md:shadow-md text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-gray-200">
        Minhas Listas de Tarefas
      </h1>

      <form action={createList} className="flex gap-2 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Nova lista"
          className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:text-gray-800"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
        >
          +
        </button>
      </form>

      <ul className="space-y-3">
        {lists.length === 0 && <p>Nenhuma lista criada ainda.</p>}
        {lists.map((list) => (
          <li key={list.id} className="flex items-center justify-between border-b pb-3" >
            <Link
              href={`/lista/${list.id}`}
              className="flex-1 font-semibold text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600"
            >
              {list.title}
              <span className="text-sm font-normal text-gray-400 ml-2">
                ( {list._count.todos} tarefas)
              </span>
            </Link>

            <form action={async () => {
                "use server"; 
                await deleteList(list.id);
              }}
            >
              <button
                type="submit"
                className="text-red-500 hover:text-red-700 text-sm font-medium ml-4"
              >
                Excluir
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
