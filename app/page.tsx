import { signOut } from "@/auth";
import MinhasListas from "./ui/minhas-listas";

export default function Home() {
  return (
    <main className="dark:bg-gray-900 flex flex-col min-h-screen">
      <div className="flex justify-end pt-2">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {/* <PowerIcon className="w-6" /> */}
            <div className="">Sign Out</div>
          </button>
        </form>
      </div>
      <MinhasListas />
    </main>
  );
}
