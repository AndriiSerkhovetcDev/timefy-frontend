import { lazy } from "react";

export const HomePage = lazy(() => import("@/pages/Home/HomePage"));
export const LoginPage = lazy(() => import("@/pages/Login/LoginPage"));
export const RegisterPage = lazy(() => import("@/pages/Register/RegisterPage"));
export const VerifyEmailPage = lazy(() => import("@/pages/VerifyEmail"));
export const ForgotPasswordPage = lazy(
  () => import("@/pages/ForgotPassword/ui/ForgotPasswordPage"),
);
export const ResetPasswordPage = lazy(() => import("@/pages/ForgotPassword/ui/ResetPasswordPage"));
export const OrganizationsPage = lazy(() => import("@/pages/Organizations/OrganizationsPage"));
export const PublicLayout = lazy(() => import("@/layouts/PublicLayout/PublicLayout"));
export const OrganizationsLayout = lazy(
  () => import("@/layouts/OrganizationsLayout/OrganizationsLayout"),
);
export const AccountLayout = lazy(() => import("@/layouts/AccountLayout/AccountLayout"));
export const NotFoundPage = lazy(() => import("@/pages/NotFound/NotFoundPage"));
export const PersonalDataPage = lazy(() => import("@/pages/Account/PersonalDataPage"));
export const SecurityPage = lazy(() => import("@/pages/Account/SecurityPage"));
export const NotificationsPage = lazy(() => import("@/pages/Account/NotificationsPage"));
export const AccountOverviewPage = lazy(() => import("@/pages/Account/AccountOverviewPage"));
