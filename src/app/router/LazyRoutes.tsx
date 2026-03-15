import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage, LoginPage, PublicLayout, RegisterPage } from ".";
import { PageLoader } from "@/shared/ui";
import { AuthCallbackPage } from "@/pages/AuthCallback/AuthCallBackPage";

const LazyRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyRoutes;
