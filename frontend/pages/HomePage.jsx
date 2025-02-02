import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import Sidebar from "../components/Sidebar.jsx";
const HomePage = () => {
  // Fetch Auth User
  // Key로 캐싱해서 불러오기
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: recommendedUsers, isLoading } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/users/suggestions");
        console.log(res.data.testing);
        return res?.data?.users;
      } catch (error) {
        console.error("Error fetching data", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Data fetched Successfully", data);
    },
    onError: (error) => {
      console.log("Query Error", error?.response?.data?.message);
    },
  });

  // 실제로 반환되는 값들은 return 에 들어가 주어야함
  const { data: posts } = useQuery({
    // Query를 Caching 해줄수 있는 Key 설정
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts");
        return res?.data?.posts;
      } catch (error) {
        console.error("Failed fetching posts", error?.response?.data?.message);
        return;
      }
    },
  });
  console.log("Posts", posts);
  console.log("recommendedUsers", recommendedUsers);
  return (
    // 전체적인 Layout 잡아주기
    // 항상 Layout + Mobile First로 잡아주기
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar 위치 잡아주기  */}
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      {/* Order first : The components appars in thr first place. */}
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />
      </div>
    </div>
  );
};

export default HomePage;
