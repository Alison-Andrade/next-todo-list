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
    redirect(`/list/${newList.id}`);
}

export async function deleteList(id: string) {
    await db.todoList.delete({
        where: { id },
    });
    revalidatePath('/');
}
