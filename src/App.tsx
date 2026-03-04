import { BrowserRouter } from "react-router-dom";
import "./App.css";
import LazyRoutes from "./app/router/LazyRoutes";

function App() {
  return (
    <BrowserRouter>
      <LazyRoutes />
    </BrowserRouter>
  );
}

export default App;
