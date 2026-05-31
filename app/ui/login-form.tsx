"use client";

import {
  ArrowRightIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { redirect, useSearchParams } from "next/navigation";
import { Button } from "./button";
import { authenticate } from "../lib/actions";
import { useActionState } from "react";
import { signIn } from "next-auth/react";
import { GoogleSignInButton } from "./google-sign-in-button";
import Link from "next/link";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div>
      <form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 dark:bg-gray-900 px-6 pb-4 pt-8">
          <h1 className="mb-3 text-2xl">Log in</h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 text-xs font-medium text-gray-900 dark:text-gray-100"
                htmlFor="username"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Digite seu email"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:peer-focus:text-white" />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 text-xs font-medium text-gray-900 dark:text-gray-100"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Digite sua senha"
                  required
                  minLength={6}
                />
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:peer-focus:text-white" />
              </div>
            </div>
          </div>

          {/* {state?.error ? (
          <p className="mt-2 text-sm text-red-500">{state.error}</p>
        ) : (
          <br />
        )} */}

          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Button className="mt-4 w-full" disabled={isPending}>
            Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <hr className="my-6" />
          <div className="flex justify-center flex-col">
            <p className="text-sm mb-6">
              Ainda não possui uma conta?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p>Ou entre com:</p>
            <GoogleSignInButton />
          </div>
        </div>
      </form>
    </div>
  );
}
