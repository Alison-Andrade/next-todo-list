import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lists = await db.todoList.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { todos: true } } },
    });

    return NextResponse.json(lists);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar listas" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const session = await auth();
    const idempotencyKey = request.headers.get("X-Idempotency-Key");

    if (!session?.user?.id)
      return NextResponse.json(
        { error: "Nao autorizado" },
        { status: 401 },
      );
    if (!title)
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 },
      );
    if (!idempotencyKey)
      return NextResponse.json(
        { error: "X-Idempotency-Key header é obrigatório" },
        { status: 400 },
      );

    // 1. Checa a idempotência no banco de dados
    const existingList = await db.todoList.findUnique({
      where: { idempotencyKey },
    });

    if (existingList) {
      return NextResponse.json(existingList, { status: 200 }); // Retorna a existente caso seja duplicado
    }

    // 2. Cria a nova lista no PostgreSQL
    const newList = await db.todoList.create({
      data: {
        title,
        idempotencyKey,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      const raceConditionList = await db.todoList.findUnique({
        where: { idempotencyKey: request.headers.get("X-Idempotency-Key")! },
      });
      return NextResponse.json(raceConditionList, { status: 200 });
    }
    return NextResponse.json({ error: "Erro ao criar lista" }, { status: 500 });
  }
}
