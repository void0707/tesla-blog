import React, { useEffect, useState } from "react";
import "./BlogPreviewPage.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import BlogGrid from "./BlogGrid";
import Logobar from "./Logobar";
import { FaUser, FaClock, FaCalendar } from "react-icons/fa";

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
    <>
      <Logobar />
      <div className="container">
        <Link to={`/`}>
          <button className="button-20">Go Back</button>
        </Link>
        {blog ? (
          <div className="preview-content">
            <h1 className="heading">{blog.title}</h1>
            <p className="story">{blog.story}</p>
            <br />
            <div className="stats">
              <p>
                <FaUser />
                &nbsp;&nbsp;{blog.author}
              </p>
              <p>
                <FaClock />
                &nbsp;&nbsp;1 min read
              </p>
              <p>
                <FaCalendar />
                &nbsp;&nbsp;{blog.date}
              </p>
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
    </>
  );
}

export default BlogPreviewPage;
