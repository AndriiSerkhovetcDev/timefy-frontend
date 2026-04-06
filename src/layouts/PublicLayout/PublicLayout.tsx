import { Header } from "@/widgets/Header";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
