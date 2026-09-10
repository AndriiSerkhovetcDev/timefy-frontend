import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { selectUser, useAuthStore } from "@/features/auth/model/authStore";
import { UserMenu } from "@/features/auth/ui";
import { Logo, ThemeToggle } from "@/shared/ui";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getAccountSection } from "../model/account";
import { AccountNavigation } from "./AccountNavigation";

export const AccountHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore(selectUser);
  const section = getAccountSection(useLocation().pathname);

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Відкрити меню особистого кабінету"
              className="lg:hidden"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(20rem,85vw)] p-5">
            <SheetHeader className="p-0 text-left">
              <SheetTitle className="flex items-center gap-2">
                <Logo />
              </SheetTitle>
              <SheetDescription>Особистий кабінет користувача</SheetDescription>
            </SheetHeader>
            <AccountNavigation onNavigate={() => setIsMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
            {section.title}
          </h1>
          <p className="hidden truncate text-sm text-muted-foreground sm:block">
            {section.description}
          </p>
        </div>

        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};
