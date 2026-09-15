import { AccountHeader } from "@/features/account/ui/AccountHeader";
import { AccountSidebar } from "@/features/account/ui/AccountSidebar";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { useOrganizationStore } from "@/features/organization/model/organizationStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export const AccountLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const user = useAuthStore(selectUser);
  const loadOrganizations = useOrganizationStore((state) => state.load);

  useEffect(() => {
    if (user?.email) void loadOrganizations(user.email).catch(() => undefined);
  }, [loadOrganizations, user?.email]);

  return (
    <div className="flex min-h-dvh bg-background">
      <AccountSidebar isCollapsed={isSidebarCollapsed} onCollapsedChange={setIsSidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AccountHeader />
        <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
