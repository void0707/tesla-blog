import React from "react";
import "./BlogCard.css";
import { Link } from "react-router-dom";

const BlogCard = ({ title, content, id, author, image }) => {
  return (
    <div className="blog-card">
      <img src={image} />
      <div className="blog-content">
        <h2 className="blog-card-title">{title}</h2>
        <p className="blog-card-content">{content}</p>
        <br />
        <p>Author: {author}</p>
        <Link to={`/blog/${id}`}>
          <button className="button-20">Read More</button>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
