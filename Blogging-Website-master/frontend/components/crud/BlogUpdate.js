import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import Router from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillFormats, QuillModules } from "../../helpers/quill";
import { API } from "../../config";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const BlogUpdate = ({ router }) => {
  const [body, setBody] = useState("");

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
    title: "",
    body: "",
  });

  const { error, success, formData, title } = values;

  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let ca = [];
    blogCategories.map((c, i) => ca.push(c._id));
    setChecked(ca);
  };

  const setTagsArray = (blogTags) => {
    let ta = [];
    blogTags.map((t, i) => ta.push(t._id));
    setCheckedTag(ta);
  };

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

  //   find checked categories
  const findOutCategories = (c) => {
    const result = checked.indexOf(c);
    // true/-1
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  // find checked tags
  const findOutTags = (t) => {
    const result = checkedTag.indexOf(t);

    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            checked={findOutCategories(c._id)}
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
            checked={findOutTags(t._id)}
            onChange={handleTagToggle(t._id)}
            className="mr-2"
            type="checkbox"
          />
          <lable className="form-check-label">{t.name}</lable>
        </li>
      ))
    );
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
    setBody(e);
    formData.set("body", e);
  };

  //   Submit form
  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `Blog titled ${data.title} is successfully updated`,
        });
        if (isAuth() && isAuth().role === 1) {
          //   Router.replace(`/admin/crud/${router.query.slug}`);
          Router.replace(`/admin`);
        } else if (isAuth() && isAuth().role === 0) {
          //   Router.replace(`/user/crud/${router.query.slug}`);
          Router.replace(`/user`);
        }
      }
    });
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
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
            Update
          </button>
        </div>
      </form>
    );
  };

  // timer
  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: "", success: "" });
  };

  return (
    <div className="container-fluid" onMouseMove={mouseMoveHandler}>
      <div className="row">
        <div className="col-md-8">
          {showSuccess()}
          {showError()}
          {updateBlogForm()}
          {body && (
            <img
              className="pt-3"
              style={{ width: "100%" }}
              src={`${API}/blog/photo/${router.query.slug}`}
              alt={title}
            />
          )}
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2 pt-3">
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

export default withRouter(BlogUpdate);
