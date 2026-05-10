import { lazy, useMemo } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { withSuspense } from "./SuspenseWrapper.tsx";

// Layouts & Route Guards
import ProtectedRoute from "./ProtectedRoute.tsx";
import PublicRoute from "./PublicRoute.tsx";
import MainLayout from "../../components/layout/MainLayout.tsx";

// Lazy Loading Pages
const Home = lazy(() => import("../../pages/main/home/Home.tsx"));
const Login = lazy(() => import("../../pages/auth/Login.tsx"));
const Register = lazy(() => import("../../pages/auth/Register.tsx"));
const AuthSuccess = lazy(() => import("../../pages/auth/AuthSuccess.tsx"));
const ForgotPassword = lazy(() => import("../../pages/auth/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("../../pages/auth/ResetPassword.tsx"));
const Tasks = lazy(() => import("../../pages/main/Tasks/Tasks.tsx"));
const Notes = lazy(() => import("../../pages/main/Notes/Notes.tsx"));
const Reminders = lazy(() => import("../../pages/main/Reminders/Reminders.tsx"));
const Events = lazy(() => import("../../pages/main/Events/Events.tsx"));
const Members = lazy(() => import("../../pages/main/Members/Members.tsx"));
const Notifications = lazy(() => import("../../pages/main/notifications/Notifications.tsx"));
const SparklesPage = lazy(() => import("../../pages/main/Sparkels/Sparkels.tsx"));
const Docs = lazy(() => import("../../pages/main/Docs/Docs.tsx"));
const NotFound = lazy(() => import("../../pages/errors/NotFound.tsx"));


export default function AppRouter() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <MainLayout />,
              children: [
                { path: "/", element: withSuspense(<Home />) },
                { path: "/notifications", element: withSuspense(<Notifications />) },
                { path: "/documentations", element: withSuspense(<Docs />) },
                {
                  path: "projects/:id",
                  children: [
                    { index: true, element: <Navigate to="tasks" replace /> },
                    { path: "tasks", element: withSuspense(<Tasks />) },
                    { path: "notes", element: withSuspense(<Notes />) },
                    { path: "reminders", element: withSuspense(<Reminders />) },
                    { path: "events", element: withSuspense(<Events />) },
                    { path: "members", element: withSuspense(<Members />) },
                    { path: "sparkles", element: withSuspense(<SparklesPage />) },
                  ],
                },
              ],
            },
          ],
        },
        {
          element: <PublicRoute />,
          children: [
            { path: "/login", element: withSuspense(<Login />) },
            { path: "/register", element: withSuspense(<Register />) },
            { path: "/forgot-password", element: withSuspense(<ForgotPassword />) },
            { path: "/reset-password/:token", element: withSuspense(<ResetPassword />) },
            { path: "/auth-success", element: withSuspense(<AuthSuccess />) },
          ],
        },
        { path: "*", element: withSuspense(<NotFound />) },
      ]),
    []
  );

  return <RouterProvider router={router} />;
}