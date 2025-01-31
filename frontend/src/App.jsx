import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
// Layout
import Layout from "../components/layout/Layout";
// Pages
import HomePage from "../pages/HomePage";
// Auth - Pages
import SignUpPage from "../pages/auth/SignUpPage";
import LoginPage from "../pages/auth/SignUpPage";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const App = () => {
  // It is used to fetch the data
  const { data: authUser, isLoading } = useQuery({
    // 캐싱을 할때 간단하게 사용됨 [전역사앹로 사용이 가능함]
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/check-auth");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status == 401) {
          return null;
        }
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  console.log("authUser", authUser);
  // Protect the routes
  if (isLoading) {
    return (
      <div className=" w-screen h-screen flex items-center justify-center">
        <Loader className="size-20 animate-spin" />
      </div>
    );
  }
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Route - Auth */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App;
