import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage, PublicLayout } from ".";

const LazyRoutes = () => {
  return (
    <Suspense fallback={<div>Завантаження</div>}>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default LazyRoutes;
