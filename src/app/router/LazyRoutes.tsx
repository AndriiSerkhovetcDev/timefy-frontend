import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  DashboardPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  PublicLayout,
  RegisterPage,
  VerifyEmailPage,
} from ".";
import { PageLoader, UserRouteGuard } from "@/shared/ui";
import { AuthCallbackPage } from "@/pages/AuthCallback/AuthCallBackPage";
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute";

const LazyRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<UserRouteGuard />}>
            <Route path="verify-email" element={<VerifyEmailPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyRoutes;
