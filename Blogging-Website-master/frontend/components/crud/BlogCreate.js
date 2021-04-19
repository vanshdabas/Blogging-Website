import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillFormats, QuillModules } from "../../helpers/quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const CreateBlog = ({ router }) => {
  const blogFromLs = () => {
    if (typeof window === "undefined") {
      return false;
    }
    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const [body, setBody] = useState(blogFromLs());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initTags();
    initCategories();
  }, [router]);
  //   if anything happen to route this will run, when component load, we have formData ready to use
  //   Browser api => FormData

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const publishBlog = (e) => {
    e.preventDefault();
    console.log(formData);
    createBlog(formData, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `A new blog titled "${data.title}" is created`,
        });
        setBody("");
        setCategories([]);
        setTags([]);
      }
    });
  };

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    console.log("name:", name);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    console.log("value", value);
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const handleBody = (e) => {
    // console.log(e);
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  // Error alert
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  // success alert
  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <lable className="text-muted">Title</lable>
          <input
            type="text"
            className="form-control"
            onChange={handleChange("title")}
            value={title}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Type something..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  // category handler
  const handleToggle = (c) => () => {
    setValues({ ...values, error: "" });
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    formData.set("categories", all);
  };

  // tag handler
  const handleTagToggle = (t) => () => {
    setValues({ ...values, error: "" });

    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggle(c._id)}
            className="mr-2"
            type="checkbox"
          />
          <lable className="form-check-label">{c.name}</lable>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleTagToggle(t._id)}
            className="mr-2"
            type="checkbox"
          />
          <lable className="form-check-label">{t.name}</lable>
        </li>
      ))
    );
  };

  // timer
  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: "", success: "" });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <div onMouseMove={mouseMoveHandler}>
            {showError()}
            {showSuccess()}
            {createBlogForm()}
            <br />
          </div>
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5>
              <hr />
              <small className="text-muted">Max size: 1 MB</small>
              <br />
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateBlog);
