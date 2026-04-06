import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const isDark = JSON.parse(localStorage.getItem("theme") || "{}")?.state?.isDark;
document.documentElement.classList.toggle("dark", !!isDark);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
