import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage, LoginPage, PublicLayout, RegisterPage } from ".";

const LazyRoutes = () => {
  return (
    <Suspense fallback={<div>Завантаження</div>}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyRoutes;
