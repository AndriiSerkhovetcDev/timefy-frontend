import { UserMenu } from "@/features/auth/ui";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Logo } from "@/shared/ui";

export const DashboardHeader = () => {
  return (
    <header
      id="header"
      className="sticky w-full top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300"
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="shrink-0 flex items-center gap-2 cursor-pointer">
            <Logo />
          </Link>

          <div className="flex items-center gap-5">
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-primary transition" />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
