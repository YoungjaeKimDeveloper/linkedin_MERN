import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
const SignUpForm = () => {
  // Form 항목 받아오기
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //  mutate: 함수이름
  const { mutate: signUpMutation, isLoading } = useMutation({
    // 실제로 실행되는 내용들
    // useMutation -> Delete,put,Post
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    // 성공시에 이루어지는 롤백 로직
    onSuccess: () => {
      toast.success("Form has been submitted successfully");
    },
    // 실패시에 이루어지는 롤백 로직
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  // Signup Submission
  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation({ name, username, email, password });
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        placeholder="Password (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <button
        type="submit"
        onSubmit={handleSignup}
        className="btn btn-primary w-full text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
