// import Footer from "./Footer";
import { Header } from "@/widgets/Header";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet></Outlet>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default PublicLayout;
