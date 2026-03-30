import { Link, useLocation } from "react-router-dom";
import { desktopNavBtns, navItems } from "../model/constans";
import MobileNav from "./MobileNav";
import { NavItem } from "./NavItem";
import { selectIsAuthenticated, useAuthStore } from "@/features/auth/model/authStore";
import { UserMenu } from "@/features/auth/ui";
import { Logo } from "@/shared/ui";

const authPages = ["login", "register", "verify-email"];

export const Header = () => {
  const location = useLocation();
  const isAuthPage = authPages.some((link) => location.pathname === `/${link}`);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return (
    <header
      id="header"
      className="sticky w-full top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="shrink-0 flex items-center gap-2 cursor-pointer">
            <Logo />
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <NavItem key={item.id} {...item} variant="desktop" />
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              desktopNavBtns
                .filter((item) => !(isAuthPage && item.id === "login"))
                .map((item) => <NavItem key={item.id} {...item} />)
            ) : (
              <UserMenu />
            )}
          </div>

          <div className="flex md:hidden items-center gap-5">
            {!isAuthPage && !isAuthenticated && (
              <div className="flex-1">
                <NavItem id="login" text="Вхід" link="/login" variant="outline" />
              </div>
            )}

            {isAuthenticated && <UserMenu />}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};
