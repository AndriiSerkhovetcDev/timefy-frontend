import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { selectUser, useAuthStore } from "../model/authStore";
import { endCurrentSession } from "../model/endSession";
import type { User } from "../model/types";
import { getUserDisplayName } from "../model/user";
import { UserAvatar } from "./UserAvatar";

type UserMenuItem = {
  id: string;
  text: string;
  link: string;
  allowedRoles?: User["role"][];
};

const userMenuItems: UserMenuItem[] = [
  { id: "account", text: "Особистий кабінет", link: "/account" },
  { id: "organizations", text: "Організації", link: "/organizations" },
  {
    id: "schemas",
    text: "Налаштування Timefy",
    link: "https://dev.timefy.online",
    allowedRoles: ["ADMIN", "SUPPORT"],
  },
];

export const UserMenu = () => {
  const user = useAuthStore(selectUser);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await endCurrentSession();
    navigate("/login", { replace: true });
  };

  const visibleItems = userMenuItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(user.role),
  );
  const displayName = getUserDisplayName(user);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto max-w-56 gap-3 rounded-full px-2 py-1.5">
          <UserAvatar user={user} className="size-9 shrink-0" />
          <span className="hidden truncate text-sm font-medium text-foreground sm:block">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block truncate">{displayName}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleItems.map((item) => (
          <DropdownMenuItem key={item.id} asChild>
            {item.link.startsWith("http") ? (
              <a href={item.link}>{item.text}</a>
            ) : (
              <Link to={item.link}>{item.text}</Link>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOut aria-hidden="true" />
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
