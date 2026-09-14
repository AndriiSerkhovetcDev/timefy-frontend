import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  AccountLayout,
  AccountOverviewPage,
  CreateOrganizationPage,
  EmployeeInvitePage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  NotificationsPage,
  OrganizationsPage,
  OrganizationOverviewPage,
  OrganizationSettingsPage,
  OrganizationTeamPage,
  OrganizationWorkspaceLayout,
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
          <Route path="employee-invite" element={<EmployeeInvitePage />} />

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
          <Route path="/organizations" element={<Navigate to="/account/organizations" replace />} />
          <Route
            path="/organizations/create"
            element={<Navigate to="/account/organizations/create" replace />}
          />

          <Route path="/organizations/:organizationId" element={<OrganizationWorkspaceLayout />}>
            <Route index element={<OrganizationOverviewPage />} />
            <Route path="team" element={<OrganizationTeamPage />} />
            <Route path="settings" element={<OrganizationSettingsPage />} />
          </Route>

          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverviewPage />} />
            <Route path="personal" element={<PersonalDataPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="organizations/create" element={<CreateOrganizationPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyRoutes;
