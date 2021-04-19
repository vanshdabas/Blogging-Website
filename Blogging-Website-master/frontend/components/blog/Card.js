import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import { API } from "../../config";

const Card = ({ blog }) => {
  let image = `${API}/blog/photo/${blog.slug}`;
  const showBlogCategories = (blog) => {
    return blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a title="category" className="btn btn-primary mr-1 ml-1 mt-3">
          {c.name}
        </a>
      </Link>
    ));
  };

  const showBlogTags = (blog) => {
    return blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a title="tag" className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {t.name}
        </a>
      </Link>
    ));
  };

  return (
    <div className="lead pb-4">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h2
              style={{ fontFamily: "Comic Sans MS" }}
              className="pt-3 pb-3 font-weight-bold"
            >
              {blog.title}
            </h2>
          </a>
        </Link>
      </header>
      <section>
        <p
          style={{ fontFamily: "Trebuchet MS" }}
          className="mark ml-1 pt-2 pb-2"
        >
          Written By{" "}
          <Link href={`/profile/${blog.postedBy.username}`}>
            <a>{blog.postedBy.username}</a>
          </Link>{" "}
          | Published {moment(blog.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        {showBlogCategories(blog)}
        {showBlogTags(blog)}
        <br /> <br />
      </section>

      <div className="blog-card">
        <div className="meta">
          <div
            className="photo"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
          <ul class="details">
            <li className="author">
              Written By
              <Link href={`/profile/${blog.postedBy.username}`}>
                <a> {blog.postedBy.username}</a>
              </Link>
            </li>
            <li className="date">Date: {moment(blog.updatedAt).fromNow()}</li>
          </ul>
        </div>
        <div className="description">
          <p>
            {renderHTML(blog.excerpt)}
            <Link href={`/blogs/${blog.slug}`}>
              <a className="btn btn-primary mt-4 text-light">Read more</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Card;
