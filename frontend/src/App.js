import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDesignTokens } from "./styles/getDesignTokens";
import { DarkModeContext } from "./shared/context/DarkModeContext";
import { Route, Routes, Redirec, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RequireAuth from "./components/shared/RequireAuth";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "./shared/hooks/useAxios";
import { logout, setUser } from "./redux/reducers/userReducer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [mode, setMode] = useState("light");
  const { token } = useSelector((state) => state.userReducer);
  const { sendRequest, error, clearError } = useAxios();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const response = await sendRequest("/users/getUser", "GET", null, { Authorization: "Bearer " + token });
          const { _id, name, email, image } = response;
          dispatch(setUser({ user: { userId: _id, name, email, image } }));
        } catch (err) {
          dispatch(logout());
        }
      }
      setIsLoading(false);
    })();
  }, [token]);

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <DarkModeContext.Provider value={{ darkMode: mode === "light" ? false : true, toggleColorMode:toggleColorMode }}>
        <CssBaseline />
        {isLoading && <div>Loading</div>}
        {!isLoading && <div className="app">{routes}</div>}
      </DarkModeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
