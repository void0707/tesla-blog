import React, { useEffect, useState } from "react";
import "./BlogPreviewPage.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function BlogPreviewPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/blog/${id}`) // replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setBlog(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <Link to={`/`}>
        <button className="button-20">Go Back</button>
      </Link>
      {blog ? (
        <div className="preview-content">
          <h1 className="heading">{blog.title}</h1>
          <p className="story">{blog.story}</p>
        </div>
      ) : (
        <h1 className="heading">Loading</h1>
      )}
    </div>
  );
}

export default BlogPreviewPage;
