import React from "react";
import "./BlogCard.css";

const BlogCard = ({ title, content }) => {
  return (
    <div className="blog-card">
      <img src="https://picsum.photos/500" />
      <div className="blog-content">
        <h2 className="blog-card-title">{title}</h2>
        <p className="blog-card-content">{content}</p>
      </div>
    </div>
  );
};

export default BlogCard;
