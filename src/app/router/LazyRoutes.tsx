import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AccountLayout,
  AccountOverviewPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  NotificationsPage,
  OrganizationsLayout,
  OrganizationsPage,
  PersonalDataPage,
  PublicLayout,
  RegisterPage,
  ResetPasswordPage,
  SecurityPage,
  VerifyEmailPage,
} from ".";
import { PageLoader, PublicRoute, UserRouteGuard } from "@/shared/ui";
import { AuthCallbackPage } from "@/pages/AuthCallback/AuthCallBackPage";
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute";

const LazyRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />

          <Route element={<PublicRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<UserRouteGuard />}>
            <Route path="verify-email" element={<VerifyEmailPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<OrganizationsLayout />}>
            <Route path="/organizations" element={<OrganizationsPage />} />
          </Route>

          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverviewPage />} />
            <Route path="personal" element={<PersonalDataPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyRoutes;
