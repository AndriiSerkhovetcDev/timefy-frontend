import { BrowserRouter } from "react-router-dom";
import "./App.css";
import LazyRoutes from "./app/router/LazyRoutes";
import { Notifications } from "./shared/ui";
import { AuthBootstrap } from "./features/auth/ui/AuthBootstrap";

function App() {
  return (
    <>
      <Notifications />
      <BrowserRouter>
        <AuthBootstrap>
          <LazyRoutes />
        </AuthBootstrap>
      </BrowserRouter>
    </>
  );
}

export default App;
