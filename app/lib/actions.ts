"use server";

import { redirect } from "next/navigation";
import { db } from "./db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";
import { auth } from "@/auth";

export async function createList(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const title = formData.get("title") as string;
  const idempotencyKey = formData.get("idempotencyKey") as string;

  if (!idempotencyKey) return;
  if (!title || title.trim() === "") return;

  const newList = await db.todoList.create({
    data: {
      title,
      idempotencyKey,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  redirect(`/lista/${newList.id}`);
}

export async function deleteList(id: string) {
  await db.todoList.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function addTodo(todoListId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const idempotencyKey = formData.get("idempotencyKey") as string;

  if (!idempotencyKey) return;
  if (!title || title.trim() === "") return;

  await db.todo.create({
    data: { title, todoListId, idempotencyKey },
  });
  revalidatePath(`/list/${todoListId}`);
}

export async function toggleTodo(
  id: string,
  isDone: boolean,
  todoListId: string,
) {
  await db.todo.update({
    where: { id },
    data: { isDone },
  });
  revalidatePath(`/list/${todoListId}`);
}

export async function deleteTodo(id: string, todoListId: string) {
  await db.todo.delete({
    where: { id },
  });
  revalidatePath(`/list/${todoListId}`);
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Email ou senha incorretos";
        default:
          return "Ocorreu um erro ao logar";
      }
    }
    throw error;
  }
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("Email e Senha são obrigatórios");
  }

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email ja cadastrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return { success: true };
}
