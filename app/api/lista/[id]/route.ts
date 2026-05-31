import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentList = await db.todoList.findUnique({
      where: { id: (await params).id },
      include: { todos: { orderBy: { createdAt: "asc" } } },
    });

    if (!currentList) {
      return NextResponse.json(
        { error: "Lista não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(currentList);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { title } = await request.json();

    const idempotencyKey = request.headers.get("X-Imdepotency-Key");

    if (!title)
      return NextResponse.json(
        { error: "Titulo é obrigatório" },
        { status: 400 },
      );
    if (!idempotencyKey)
      return NextResponse.json(
        { error: "X-Imdepotency-Key header é obrigatório" },
        { status: 400 },
      );

    const existingTodo = await db.todo.findUnique({
      where: {
        idempotencyKey,
      },
    });

    if (existingTodo) {
      return NextResponse.json({ existingTodo }, { status: 200 });
    }

    const newTodo = await db.todo.create({
      data: {
        title,
        idempotencyKey,
        todoListId: (await params).id,
      },
    });

    return NextResponse.json({ newTodo }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code: string };
    if (err.code === "P2002") {
      const raceConditionTodo = await db.todo.findUnique({
        where: {
          idempotencyKey: request.headers.get("X-Imdepotency-Key")!,
        },
      });
      return NextResponse.json({ raceConditionTodo }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Erro ao criar tarefa" },
      { status: 500 },
    );
  }
}
