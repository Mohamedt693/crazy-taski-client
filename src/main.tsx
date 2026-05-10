import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Import AppRouter as a Component
import AppRouter from "./utils/Routing/AppRouter.tsx"; 
// CSS Imports
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
// Toastify
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      draggable
    />
  </StrictMode>
);