import { createBrowserRouter } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { NotFound } from "../pages/NotFound";
import { Landing } from "../pages/Landing";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { Modules } from "../pages/Modules";
import { Dashboard } from "../pages/Dashboard";
import { Trainer } from "../pages/Trainer";
import { Flashcards } from "../pages/Flashcards";

const ProtectedDashboard = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

const ProtectedModules = () => {
  return (
    <ProtectedRoute>
      <Modules />
    </ProtectedRoute>
  );
};

const ProtectedTrainer = () => {
  return (
    <ProtectedRoute>
      <Trainer />
    </ProtectedRoute>
  );
};

const ProtectedFlashcards = () => {
  return (
    <ProtectedRoute>
      <Flashcards />
    </ProtectedRoute>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "dashboard",
        Component: ProtectedDashboard,
      },
      {
        path: "modules",
        Component: ProtectedModules,
      },
      {
        path: "trainer",
        Component: ProtectedTrainer,
      },
      {
        path: "flashcards",
        Component: ProtectedFlashcards,
      },
    ],
  },
]);
