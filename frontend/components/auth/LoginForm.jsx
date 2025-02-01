import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // 여기에서 부터 이해안됨 (Get용)
  const queryClient = useQueryClient();
  // Query Mutation(POST용)
  const { mutate: loginMutation, isLoading } = useMutation({
    mutationKey: ["authUser"],
    mutationFn: async (userData) => {
      console.log("실제로 전달되는 데이터", userData);
      const res = await axiosInstance.post("/auth/login", userData);
      console.log("응답받은 데이터", res);
      return res?.data?.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ username, password });
    setUsername("");
    setPassword("");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
      />

      <button type="submit" className="btn btn-primary w-full">
        {isLoading ? <Loader className="size-5 animate-spin" /> : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
