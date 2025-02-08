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
  // Mutate ->실제로 실행되는 함수
  const { mutate: loginMutation, isLoading } = useMutation({
    // 나중에 캐싱할 수 있도록 authUser넣어주기
    mutationKey: ["authUser"],
    // 실제로 실핻되는 Function = mutationFn
    mutationFn: async (userData) => {
      const res = await axiosInstance.post("/auth/login", userData);

      return res?.data?.user;
    },
    // TRY - CATCH 대신에 성공 /실패 될경우 롤백함수 실행해주기
    // queryClient.invalidateQueries({ queryKey: ["authUser"] }); -> Key 값 실제로 업데이트 해주기
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제로 함수 이름은 login mutaiton 위에서 불러와서 실행해주기
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
