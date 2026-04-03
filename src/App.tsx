import { BrowserRouter } from "react-router-dom";
import "./App.css";
import LazyRoutes from "./app/router/LazyRoutes";
import { Notifications } from "./shared/ui";

function App() {
  return (
    <>
      <Notifications />
      <BrowserRouter>
        <LazyRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
