import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { MessageSquare, ThumbsUp, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const NotificationPage = () => {
  // 쿼리 클라이언트
  const queryClient = useQueryClient();
  // Auth User 에서 데이터 불러와주기
  const { data: user } = useQuery({ queryKey: ["authUser"] });
  // notifications 불러오기
  const { data: notifications, isLoading: notificationLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  });
  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
  const { mutate: deleteNotification, isLoading: isLoadingNotification } =
    useMutation({
      mutationFn: (id) => {
        axiosInstance.delete(`/notifications/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.success("Notification has been deleted successfully ✅");
      },
      onError: (error) => {
        console.error(
          "- From FrontEnd - [deleteNotification]",
          error?.response?.data?.message
        );
        toast.error("Error in [deleteNotification]", error);
      },
    });
  // 타입별로 아이콘 보여주기
  const renderNotification = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp size={20} className="text-blue-500" />;
      case "comment":
        return <MessageSquare size={20} className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus className="text-purple-500" size={20} />;
      default:
        return null;
    }
  };
  // enum type 별로 context바꿔서 보여주기
  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification.relatedUser.name}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>
            accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };

  return <div>NotificationPage</div>;
};

export default NotificationPage;
