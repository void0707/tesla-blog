import "./BlogGrid.css";
import BlogCard from "./BlogCard";
const BlogGrid = ({ blogs }) => {
  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} title={blog.title} content={blog.description} />
      ))}
    </div>
  );
};

export default BlogGrid;
