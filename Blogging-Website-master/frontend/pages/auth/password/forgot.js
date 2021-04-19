import { useState } from "react";
import Layout from "../../../components/Layout";
import { forgotPassword } from "../../../actions/auth";
import "../../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
    showForm: true,
  });

  const { email, message, error, showForm } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, message: "", error: "", [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, message: "", error: "" });
    forgotPassword({ email }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
        toast.error(data.error);
      } else {
        setValues({
          ...values,
          message: data.message,
          email: "",
          showForm: false,
        });
        toast.success(data.message);
      }
    });
  };

  const passwordForgotForm = () => (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            className="form-control"
            type="email"
            onChange={handleChange("email")}
            value={email}
            placeholder="Type your email"
          />
        </div>
        <div>
          <button className="btn btn-primary">Send Link</button>
        </div>
      </form>
    </div>
  );

  return (
    <Layout>
      <ToastContainer />
      <div className="container">
        <h2 className="mt-5">Forgot Password</h2>
        <hr />
        {showForm && passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
