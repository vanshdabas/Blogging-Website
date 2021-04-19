import { useState, useEffect } from "react";
import { signup, isAuth, preSignup } from "../../actions/auth";
import Router, { withRouter } from "next/router";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { name, email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };

    preSignup(user).then((data) => {
      console.log("SignupComp", data);
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
        toast.error(data.error);
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          loading: false,
          message: data.message,
          showForm: false,
        });
        toast.success(data.message);
      }
    });
  };
  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      error: false,
      [name]: e.target.value,
    });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange("name")}
            className="form-control"
            type="text"
            placeholder="Name"
          />
        </div>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            className="form-control"
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            className="form-control"
            type="password"
            placeholder="Password"
          />
        </div>
        <div>
          <button className="btn btn-primary">Signup</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      <ToastContainer />
      {/* {showLoading()}
      {showMessage()} */}
      {showForm && signupForm()}
    </React.Fragment>
  );
};

export default withRouter(SignupComponent);
