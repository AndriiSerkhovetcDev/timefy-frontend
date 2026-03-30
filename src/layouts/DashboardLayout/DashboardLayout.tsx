import { DashboardHeader } from "./DashboardHeader";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
