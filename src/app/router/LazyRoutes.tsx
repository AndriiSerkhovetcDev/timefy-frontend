import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { DashboardPage, HomePage, LoginPage, PublicLayout, RegisterPage, VerifyEmailPage } from ".";
import { PageLoader } from "@/shared/ui";
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
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyRoutes;
