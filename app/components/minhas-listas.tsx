import Link from "next/link";
import { db } from "../lib/db";
import { deleteList } from "../lib/actions";

export default async function MinhasListas() {
  const lists = await db.todoList.findMany({
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg md:shadow-md text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Minhas Listas de Tarefas
      </h1>

      <form action="" className="flex gap-2 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Nome da nova lista..."
          className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <li key={list.id}>
            <Link
              href={`/lista/${list.id}`}
              className="flex-1 font-semibold text-lg text-gray-700 hover:text-blue-600"
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
