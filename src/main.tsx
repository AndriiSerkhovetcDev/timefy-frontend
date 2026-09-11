import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initializeAuthSessionSync } from "./features/auth/model/authStore";
import { initializeTheme } from "./shared/model/themeStore";

initializeTheme();
initializeAuthSessionSync();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
