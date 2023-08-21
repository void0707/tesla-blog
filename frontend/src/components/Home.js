import React, { useEffect, useState } from "react";
import BlogGrid from "./BlogGrid";
import "./Home.css";
import Logobar from "./Logobar";

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
      <Logobar />
      {isLoading ? (
        <div className="Loading">Loading...</div>
      ) : (
        <div className="container">
          <center>
            {" "}
            <h1 className="banner text-dark">
              Charging Up Your Tesla News - Stay Current with the Latest Updates
              and Insights!
            </h1>
          </center>
          <h1 class="h1 text-dark">Recent Posts</h1>
          <br />
          <br />
          <BlogGrid blogs={blogs} />
        </div>
      )}
    </>
  );
};

export default Home;
