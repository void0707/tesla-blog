import React from "react";
import BlogCard from "./BlogCard";
import "./BlogGrid.css";

const BlogGrid = ({ blogs }) => {
  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} title={blog.title} content={blog.description} />
      ))}
    </div>
  );
};

export default BlogGrid;
