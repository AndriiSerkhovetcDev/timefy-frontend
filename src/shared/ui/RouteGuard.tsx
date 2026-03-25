import { Navigate, Outlet } from "react-router-dom";

type RouteGuardProps = {
  condition: boolean;
  redirectTo: string;
};

export const RouteGuard = ({ condition, redirectTo }: RouteGuardProps) => {
  if (!condition) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
};
