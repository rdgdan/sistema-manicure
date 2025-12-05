
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./AppRoutes";
import './App.css'; // <-- ADICIONANDO A IMPORTAÇÃO

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <AppRoutes />
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
