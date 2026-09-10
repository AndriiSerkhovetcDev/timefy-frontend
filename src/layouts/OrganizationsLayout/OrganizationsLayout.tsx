import { Outlet } from "react-router-dom";
import { OrganizationsHeader } from "./OrganizationsHeader";

export const OrganizationsLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <OrganizationsHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default OrganizationsLayout;
