import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Theme
import { themeSettings } from "theme";

// Scenes
import {
  Layout,
  Dashboard,
  Products,
  Customers,
  Transactions,
  Geography,
  Overview,
  Daily,
  Monthly,
  Breakdown,
  Admin,
  Performance,
} from "scenes";

// 🚨 NAYE IMPORTS
import LoginPage from "./scenes/loginPage"; 
import LandingPage from "./scenes/landingPage";

// App
const App = () => {
  // 1. Theme State
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // 2. Auth State (Checking if user is logged in)
  const user = useSelector((state) => state.global.user);
  const isAuth = Boolean(user);

  return (
    <div className="app">
      <BrowserRouter>
        {/* Theme Provider */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          
          <Routes>
            {/* 🌟 PUBLIC ROUTES (Bina login ke khulenge) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/dashboard" replace />} />

            {/* 🔒 PROTECTED ROUTES (Sirf tab khulenge jab isAuth true hoga) */}
            <Route element={isAuth ? <Layout /> : <Navigate to="/login" replace />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />
            </Route>
            
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;