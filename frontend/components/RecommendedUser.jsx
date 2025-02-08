import React from "react";
// TanStack Library
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// External Library
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";
// Utility Module
import { axiosInstance } from "../lib/axios";
// Suggestion of the users
const RecommendedUser = ({ user }) => {
  const queryClient = useQueryClient();
  // fetch the Connection Status
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionsStatus", user._id],
    queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
  });
  console.log("현재 Connection Status: ", connectionStatus);
  // 요청 보낼때 Request가 잘못 절정됨
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent successfully");
      queryClient.invalidateQueries({
        // only specific ID will be updated
        queryKey: ["connectionsStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "An error occured in [sendConnectionRequest]"
      );
    },
  });

  // Request 수락해주기
  // ❌ fix
  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestedId) =>
      // 여기에서 보내는곳 보기
      axiosInstance.put(`/connections/accept/${requestedId}`),
    onSuccess: () => {
      toast.success("Connection Request accepted");
      queryClient.invalidateQueries(["connectionsStatus", user._id]);
      queryClient.invalidateQueries({ queryKey: "recommendedUsers" });
      // todo:c check if we need to invalidate other quries
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error || "An Error occurred in [acceptRequest"
      );
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection Request rejected");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
      // tood: check if we need to invalidate other quries
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error Occured in rejectRequest"
      );
    },
  });
  // Render the UI With the case
  const renderButton = () => {
    if (isLoading) {
      <button className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500 disabled">
        Loading...
      </button>;
    }
    switch (connectionStatus?.data?.status) {
      case "pending":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center"
            disabled
          >
            <Clock size={16} className="mr-1" />
            Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => acceptRequest(connectionStatus.data.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.data.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center"
            disabled
          >
            <UserCheck size={16} className="mr-1" />
            Connected
          </button>
        );
      default:
        return (
          <button
            className="px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center"
            onClick={handleConnect}
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };

  const handleConnect = () => {
    if (connectionStatus?.data?.status === "not_connected") {
      sendConnectionRequest(user._id);
    }
  };
  return (
    <div className="flex items-center justify-center mb-4">
      <Link
        to={`/profile/${user?.username}`}
        className="flex items-center flex-grow"
      >
        <img
          src={user.profilePicture || "../public/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-sm">{user.name}</h3>
          <p className="text-xs text-info">{user.headline}</p>
        </div>
      </Link>
      {renderButton()}
    </div>
  );
};

export default RecommendedUser;
