import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
// Components
import Sidebar from "../components/Sidebar.jsx";
import PostCreation from "../components/PostCreation.jsx";
import Post from "../components/Post.jsx";
import RecommendedUser from "../components/RecommendedUser.jsx";
// Lucid
import { Users } from "lucide-react";
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
      console.log("여기에서 실제로 가져와 지는 데이터", posts);
      const res = await axiosInstance.get("/posts");
      return res?.data;
    },
  });
  console.log("포스팅 데이터 구조 확인:", posts);

  console.log("recommendedUsers", recommendedUsers);
  return (
    // 전체적인 Layout 잡아주기
    // 항상 Layout + Mobile First로 <
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar 위치 잡아주기  */}
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      {/* Order first : The components appars in thr first place. */}
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />
        {/* Post 불러와주기 */}
        {/* 항상 컴포넌트 깔끔하게 유지해주기 */}
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      {/* 포스팅 없을때 */}
      {/* 항상  */}
      {posts?.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-6">
            <Users size={64} className="mx-auto text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            No Posts Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Connect with others to start seeing posts in your feed!
          </p>
        </div>
      )}
      {/* 사이드바에 유저 나타내주기 */}
      {recommendedUsers?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
