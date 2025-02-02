import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
const PostCreation = () => {
  // 사용자가 입력할 정보들
  const [content, setContent] = useState("");
  // Image는 Null 로 설정해주기
  const [image, setImage] = useState(null);
  const [imagePriview, setImagePriview] = useState(null);

  // 실제로 Query를 보내는 Client
  const queryClient = useQueryClient();
  const { mutate: createPost } = useMutation({
    // 캐싱에 사용되는값
    mutationKey: ["posts"],
    // 실제로 createPost에 사용되는 Function 값
    mutationFn: async () => {
      return axiosInstance.post("/posts/create", data);
    },
    // 성공시
    onSuccess: () => {
      toast.success("Post Created!  ✅");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    // 실패시
    onError: (err) => {
      toast.error("Failed to create new Post", err?.response?.data?.message);
    },
  });
  return <div>PostCreation</div>;
};

export default PostCreation;
