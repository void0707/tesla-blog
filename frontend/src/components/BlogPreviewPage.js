import React, { useEffect, useState } from "react";
import "./BlogPreviewPage.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";
import BlogGrid from "./BlogGrid";

function BlogPreviewPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Find the blog with the given ID
    console.log(id);
    fetch("/blogs.json") // replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const found = data.find((b) => b._id === id);
        setBlogs(data);
        setBlog(found);
        console.log(found);
      });
  }, [id]);

  return (
    <div className="container">
      <Link to={`/`}>
        <button className="button-20">Go Back</button>
      </Link>
      {blog ? (
        <div className="preview-content">
          <h1 className="heading">{blog.title}</h1>
          <p className="story">{blog.story}</p>
          <div className="creds">
            <br /> <p> Author: {blog.author}</p>
            <p>Date: {blog.date.substring(0, 10)}</p>
          </div>
        </div>
      ) : (
        <h1 className="heading">Loading</h1>
      )}

      <div className="related">
        <h1 className="heading">View Other Blogs</h1>
        <BlogGrid blogs={blogs.filter((blog) => blog._id !== id)} />
      </div>
    </div>
  );
}

export default BlogPreviewPage;
