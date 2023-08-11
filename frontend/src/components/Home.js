import React, { useEffect, useState } from "react";
import BlogGrid from "./BlogGrid";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/blogs.json") // replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data);
        setIsLoading(false);
      })

      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {" "}
      {isLoading ? (
        <div className="Loading">Loading...</div>
      ) : (
        <div className="container">
          <center>
            {" "}
            <h1 className="heading">Tesla Of Texas</h1>
            <p className="subheading">Daily Updates</p>
          </center>

          <BlogGrid blogs={blogs} />
        </div>
      )}
    </>
  );
};

export default Home;
