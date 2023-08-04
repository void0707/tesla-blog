import "./BlogGrid.css";
import BlogCard from "./BlogCard";
const BlogGrid = ({ blogs }) => {
  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          title={blog.title}
          content={blog.description}
          id={blog._id}
        />
      ))}
    </div>
  );
};

export default BlogGrid;
