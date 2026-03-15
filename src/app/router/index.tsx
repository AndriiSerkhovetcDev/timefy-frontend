import { lazy } from "react";

export const HomePage = lazy(() => import("@/pages/Home/HomePage"));
export const LoginPage = lazy(() => import("@/pages/Login/LoginPage"));
export const RegisterPage = lazy(() => import("@/pages/Register/RegisterPage"));
export const DashboardPage = lazy(() => import("@/pages/Dashboard/DashboardPage"));
export const PublicLayout = lazy(() => import("@/layouts/PublicLayout/PublicLayout"));
