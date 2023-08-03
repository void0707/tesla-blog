import React, { useEffect, useState } from "react";
import BlogGrid from "./components/BlogGrid";
import "./app.css";
const App = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://tesla-blog.onrender.com") // replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error(error));
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="container">
      <center>
        {" "}
        <h1 className="heading">Tesla Of Texas</h1>
        <p className="subheading">Daily Updates</p>
      </center>
      <BlogGrid blogs={blogs} />
    </div>
  );
};

export default App;
