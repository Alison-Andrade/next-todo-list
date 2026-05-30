'use server';

import { redirect } from "next/navigation";
import { db } from "./db";
import { revalidatePath } from "next/cache";

export async function createList(formData: FormData) {
    const title = formData.get('title') as string;
    if (!title || title.trim() === '') return;

    const newList = await db.todoList.create({
        data: { title },
    });

    revalidatePath('/');
    redirect(`/lista/${newList.id}`);
}

export async function deleteList(id: string) {
    await db.todoList.delete({
        where: { id },
    });
    revalidatePath('/');
}

export async function addTodo(todoListId: string, formData: FormData) {
    const title = formData.get('title') as string;
    if (!title || title.trim() === '') return;

    await db.todo.create({
        data: { title, todoListId },
    });
    revalidatePath(`/list/${todoListId}`);
}
    
export async function toggleTodo(id: string, isDone: boolean, todoListId: string) {
    await db.todo.update({
        where: { id },
        data: { isDone },
    })
    revalidatePath(`/list/${todoListId}`);
}

export async function deleteTodo(id: string, todoListId: string) {
    await db.todo.delete({
        where: { id },
    });
    revalidatePath(`/list/${todoListId}`);
}