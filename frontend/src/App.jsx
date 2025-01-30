import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "../components/layout/Layout";
// Pages
import HomePage from "../pages/HomePage";
// Auth - Pages
import SignUpPage from "../pages/auth/SignUpPage";
import LoginPage from "../pages/auth/SignUpPage";
const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Route - Auth */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
