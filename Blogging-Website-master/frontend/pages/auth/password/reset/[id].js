import { useState } from "react";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { resetPassword } from "../../../../actions/auth";
import "../../../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

const ResetPassword = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    error: "",
    message: "",
    showForm: true,
  });

  const { name, newPassword, error, message, showForm } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({ newPassword, resetPasswordLink: router.query.id }).then(
      (data) => {
        if (data.error) {
          setValues({
            ...values,
            error: data.error,
            showForm: false,
            newPassword: "",
          });
          toast.error(data.error);
        } else {
          setValues({
            ...values,
            message: data.message,
            showForm: false,
            newPassword: "",
            error: false,
          });
          toast.success(data.message);
        }
      }
    );
  };

  const passwordResetForm = () => (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group pt-5">
          <input
            className="form-control"
            type="password"
            onChange={(e) =>
              setValues({ ...values, newPassword: e.target.value })
            }
            value={newPassword}
            placeholder="Type new Password"
          />
        </div>
        <div>
          <button className="btn btn-primary">Change Password</button>
        </div>
      </form>
    </div>
  );

  return (
    <Layout>
      <ToastContainer />
      <div className="container">
        <h2 className="mt-5">Reset Password</h2>
        <hr />
        {showForm && passwordResetForm()}
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
