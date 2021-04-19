import Link from "next/link";
import { useState, useEffect } from "react";
import { getCookie, isAuth, updateUser } from "../../actions/auth";
import { getProfile, update } from "../../actions/user";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";
import { API } from "../../config";

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    password: "",
    error: false,
    success: false,
    loading: false,
    photo: "",
    userData: "",
  });

  const token = getCookie("token");

  const {
    username,
    name,
    email,
    about,
    password,
    error,
    success,
    loading,
    photo,
    userData,
  } = values;

  const init = () => {
    getProfile(token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          username: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    let userFormData = new FormData();
    userFormData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      userData: userFormData,
      error: false,
      success: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    update(token, userData).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false,
        });
        toast.error(data.error);
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            email: data.email,
            about: data.about,
            success: true,
            loading: false,
          });
        });

        toast.success("Profile updated successfully");
      }
    });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="btn btn-outline-info">
          Profile Photo
          <input
            onChange={handleChange("photo")}
            type="file"
            accept="image/*"
            hidden
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Username</label>
        <input
          value={username}
          onChange={handleChange("username")}
          type="text"
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control"
          disabled
        />
      </div>

      <div className="form-group">
        <label className="text-muted">About</label>
        <input
          value={about}
          onChange={handleChange("about")}
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control"
        />
      </div>
      <div>
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="btn btn-primary"
        >
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="row">
        <div className="col-md-4">
          <img
            src={`${API}/user/photo/${username}`}
            className="img img-fluid img-thumbnail mb-3 mr-4"
            style={{ maxHeight: "auto", maxWidth: "100%" }}
            alt="user profile"
          />
        </div>
        <div className="col-md-8 mb-5">{profileUpdateForm()}</div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
