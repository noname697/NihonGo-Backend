import { Outlet } from "react-router";
import { NavBar } from "./NavBar";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-paper-soft text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
