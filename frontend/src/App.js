import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { getDesignTokens } from "./styles/getDesignTokens";
import { DarkModeContext } from "./shared/context/DarkModeContext";
import { Route, Navigate, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { SocketProvider } from "./shared/context/SocketContext";

function App() {
  const [mode, setMode] = useState("dark");

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <DarkModeContext.Provider
        value={{ darkMode: mode === "light" ? false : true, toggleColorMode: toggleColorMode }}
      >
        <CssBaseline />

        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <Home />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </DarkModeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
