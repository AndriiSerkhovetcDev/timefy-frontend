import { lazy } from "react";

export const HomePage = lazy(() => import("@/pages/Home/HomePage"));
export const LoginPage = lazy(() => import("@/pages/Login/LoginPage"));
export const RegisterPage = lazy(() => import("@/pages/Register/RegisterPage"));
export const VerifyEmailPage = lazy(() => import("@/pages/VerifyEmail"));
export const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPassword"));
export const ResetPasswordPage = lazy(() => import("@/pages/ForgotPassword/"));
export const DashboardPage = lazy(() => import("@/pages/Dashboard/DashboardPage"));
export const PublicLayout = lazy(() => import("@/layouts/PublicLayout/PublicLayout"));
export const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout/DashboardLayout"));
export const SchemasPage = lazy(() => import("@/pages/Schemas/SchemasPage"));
