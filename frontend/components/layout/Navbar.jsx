import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Home, Users, Bell, User, LogOut, Cone } from "lucide-react";

const Navbar = () => {
  // 다른곳에서 Key값 불른것 가져오기
  // Query로 불러오는값들은 항상 Data 안에 담겨져셔 들어오게됌
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  // Notification 불러오기
  const { data: notifications } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/notifications");

        toast.success("Get the Notification Successfully");
        return res.data.notifications;
      } catch (error) {
        console.error(error?.message);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
    // authUser 가있을때만 불러오게할수있음
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    // 캐싱할수 있게 키 만들어주기
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/connections/requests");

        toast.success("Get the connections Successfully");
        return res.data.connectionRequests;
      } catch (error) {
        console.error(error?.message);
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong with connectionRequests"
        );
      }
    },
    // AuthUser가 있을때만 가능함
    enabled: !!authUser,
  });
  // 실제 실행되는 함수이름은 signOutMutation
  const { mutate: signOutMutation } = useMutation({
    mutationFn: async () => {
      return axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      toast.success("User Logged Out✅");
      // What is this for?

      
      // 최샌상태로 업데이트해줌
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(
        "Logged out failed",
        error?.response?.data?.message || "Something went wrong to Signout"
      );
    },
  });

  const unreadNotificationCount = notifications?.filter(
    (notification) => !notification.read
  ).length;

  const unreadConnectionRequestsCount = connectionRequests?.filter(
    (connectionRequest) => !connectionRequest.read
  ).length;
  //
  "Connection Requests", connectionRequests;
  return (
    <nav className="bg-blue-200 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                className="h-8 rounded"
                src="/small-logo.png"
                alt="LinkedIn"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            {authUser ? (
              <>
                <Link
                  to={"/"}
                  className="text-neutral flex flex-col items-center"
                >
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Users size={20} />
                  <span className="text-xs hidden md:block">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center"
                >
                  <User size={20} />
                  <span className="text-xs hidden md:block">Me</span>
                </Link>
                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => signOutMutation()}
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
