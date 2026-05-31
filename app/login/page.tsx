import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "../ui/login-form";

export default async function Home() {

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    redirect('/dashboard');
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800 dark:text-white">
      <div className="relative mx-auto w-full max-w-md flex-col space-y-2.5 md:-mt-32">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
