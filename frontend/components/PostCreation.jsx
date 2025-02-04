import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Image, Loader } from "lucide-react";
const PostCreation = ({ user }) => {
  // 사용자가 입력할 정보들
  const [content, setContent] = useState("");
  // Image는 Null 로 설정해주기
  const [image, setImage] = useState(null);
  const [imagePriview, setImagePriview] = useState(null);

  // 실제로 Query를 보내는 Client
  const queryClient = useQueryClient();
  // Create Post Mutation
  const { mutate: createPostMutation, isPending } = useMutation({
    // 캐싱에 사용되는값
    mutationKey: ["posts"],
    // 실제로 createPost에 사용되는 Function 값
    mutationFn: async (postData) => {
      console.log(postData);
      const res = await axiosInstance.post("/posts/create", postData);
      return res?.data;
    },
    // 성공시
    onSuccess: () => {
      toast.success("Post Created!  ✅");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      resetForm();
    },
    // 실패시
    onError: (err) => {
      toast.error(
        "Failed to create new Post",
        err?.response?.data?.message ||
          "Something went wrong in [createPostMutation]"
      );
    },
  });
  // 이미지 파일을 인코등 base 64 로 변환하는과정
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then((base64) => {
        setImage(base64);
        setImagePriview(base64);
      });
    } else {
      setImage(null);
      setImagePriview(null);
    }
  };
  // 직접적으로 creationg 하는 Part
  const handlePostCreation = async () => {
    try {
      // 백엔드로 보내줄 데이터 모아주기
      const postData = { content };

      if (image) {
        postData.image = image;
      }
      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation", error);
    }
  };

  // Reset the All the forms
  const resetForm = () => {
    setContent("");
    setImage("");
    setImagePriview("");
  };
  // 이미지 + 이미지 Preview 설정하기

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file); // base 64
    });
  };
  // 데이터 불러와주기
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });
  console.log(posts);
  return (
    <div className="bg-gray-100 rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || "../public/avatar.png"}
          alt="user-image"
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-200 hover:bg-base-200 foucs:bg-base-200 foucs:outline-none resize-none transition-colors  duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {imagePriview && (
        <div className="mt-4">
          <img
            src={imagePriview}
            alt="Selected"
            className="w-full h-auto rounded-lg max-w-md max-h-64 object-fill"
          />
        </div>
      )}
      {/* Deep focus */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex justify-between items-center mt-4 gap-4">
          <div className="flex space-x-4">
            <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
              <Image size={20} className="mr-2" />
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <button
            className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
            onClick={handlePostCreation}
            disabled={isPending}
          >
            {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;
