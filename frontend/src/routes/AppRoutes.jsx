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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "modules",
        element: (
          <ProtectedRoute>
            <Modules />
          </ProtectedRoute>
        ),
      },
      {
        path: "trainer",
        element: (
          <ProtectedRoute>
            <Trainer />
          </ProtectedRoute>
        ),
      },
      {
        path: "flashcards",
        element: (
          <ProtectedRoute>
            <Flashcards />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
