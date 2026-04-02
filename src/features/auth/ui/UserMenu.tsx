import { useEffect, useRef, useState } from "react";
import { selectUser, useAuthStore } from "../model/authStore";
import defaultUserImg from "@/assets/default-avatar.png";
import { Link, useNavigate } from "react-router-dom";

export const userMenuItems = [
  { id: "dashboard", text: "Дашборд", link: "/dashboard", isDanger: false, isAdmin: false },
  { id: "schemas", text: "Схеми", link: "/schemas", isDanger: false, isAdmin: true },
  { id: "logout", text: "Вийти", isDanger: true, isAdmin: false },
];

const dangeLinkStyle = "text-red-500 hover:bg-red-50";
const defaultLinkStyle = "text-gray-700 hover:bg-gray-50 hover:text-primary";

export const UserMenu = () => {
  const [isOpenDropdwn, setIsOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore(selectUser);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const filteredItems = userMenuItems.filter((item) => !item.isAdmin || user?.role === "ADMIN");
  const isShowLogin = user?.authData?.isWeb && !(user.first_name || user.last_name);

  const handleOpenDropdown = () => {
    setIsOpenDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDropdown = !dropdownRef.current?.contains(event.target as Node);

      if (isOutsideDropdown) {
        setIsOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="relative" ref={dropdownRef}>
        <img
          className="w-10 h-10 p-1 rounded-full cursor-pointer"
          src={user?.avatar ?? defaultUserImg}
          alt="Bordered avatar"
          onClick={handleOpenDropdown}
        />

        {isOpenDropdwn && (
          <div
            id="userDropdown"
            className="absolute right-0 top-12 z-10 bg-white border border-gray-100 rounded-xl shadow-sm w-48"
          >
            <p className="px-4 pt-3 pb-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
              Обліковий запис
            </p>

            <div className="px-4 pb-4 pt-2 border-b border-gray-100">
              {user?.first_name && user.last_name && (
                <div className="font-medium text-sm text-primary">
                  {user?.first_name} {user.last_name}
                </div>
              )}
              {isShowLogin && <div className="font-medium text-sm text-primary">{user?.login}</div>}
              <div className="truncate text-xs text-gray-500">{user?.email}</div>
            </div>

            <ul className="p-2">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  {item.link ? (
                    <Link
                      to={item.link}
                      className={`block w-full px-3 py-2 text-sm rounded-lg transition
          ${item.isDanger ? dangeLinkStyle : defaultLinkStyle}`}
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      {item.text}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
