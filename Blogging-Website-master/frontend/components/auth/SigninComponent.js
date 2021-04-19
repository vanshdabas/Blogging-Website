import { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import Router from "next/router";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import LoginGoogle from "./LoginGoogle";
import LoginFacebook from "./LoginFacebook";

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setValues({ ...values, loading: true, error: false });
    const user = { email, password };

    signin(user).then((data) => {
      // console.log("SigninComp", data);
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
        toast.error(data.error);
      } else {
        // save user token to cookie
        // save user info to localStorage
        // authenticate user

        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            Router.push(`/admin`);
          } else {
            Router.push(`/user`);
          }
        });
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

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
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
          <button className="btn btn-primary">Signin</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <LoginFacebook />
      <LoginGoogle />
      {showForm && signinForm()}
      <br />
      <Link href="/auth/password/forgot">
        <a className="btn btn-outline-danger btn-sm">Reset Password</a>
      </Link>
    </React.Fragment>
  );
};

export default SigninComponent;
