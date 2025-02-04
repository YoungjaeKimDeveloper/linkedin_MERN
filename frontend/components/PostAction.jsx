import React from "react";
// 자주쓰는 컴포넌트
const PostAction = ({ icon, text, onClick }) => {
  return (
    <button className="flex items-center" onClick={onClick}>
      <span className="mr-1">{icon}</span>
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
};

export default PostAction;
