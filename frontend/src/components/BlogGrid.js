import "./BlogGrid.css";
import BlogCard from "./BlogCard";
const BlogGrid = ({ blogs }) => {
  return (
    <div className="grid-container">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          title={blog.title}
          content={blog.description}
          id={blog._id}
          author={blog.author}
          image={blog.image}
          date={blog.date}
        />
      ))}
    </div>
  );
};

export default BlogGrid;
