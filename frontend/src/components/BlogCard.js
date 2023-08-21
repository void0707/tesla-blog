import React from "react";
import "./BlogCard.css";
import { Link } from "react-router-dom";
import { FaUser, FaClock, FaCalendar } from "react-icons/fa";

const BlogCard = ({ title, content, id, author, image, date }) => {
  return (
    <div className="blog-card">
      <div className="image-container">
        <img src={image} />
      </div>
      <div className="blog-content">
        <Link className="blog-card-title text-dark" to={`/blog/${id}`}>
          {" "}
          <h2>{title}</h2>
        </Link>
        <p className="blog-card-content">{content}</p>
        <br />

        <div className="stats">
          <p>
            <FaUser />
            &nbsp;&nbsp;{author}
          </p>
          <p>
            <FaClock />
            &nbsp;&nbsp;1 min read
          </p>
          <p>
            <FaCalendar />
            &nbsp;&nbsp;{date}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
