import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Footer from "./hooks/layouts/Footer";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        < Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
