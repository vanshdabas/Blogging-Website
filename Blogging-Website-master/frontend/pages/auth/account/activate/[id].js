import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { signup } from "../../../../actions/auth";
import "../../../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    error: "",
    loading: false,
    success: false,
    showButton: true,
  });

  const { name, token, error, loading, success, showButton } = values;

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    signup({ token }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false,
          showButton: false,
        });
        toast.error(data.error);
      } else {
        setValues({
          ...values,
          loading: false,
          success: true,
          showButton: false,
        });
        // toast.success(data.message);
        toast.success(data.message);
      }
    });
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="container">
        <h3 className="mt-5">Hey {name}, Ready to activate your account ?</h3>

        {showButton && (
          <button
            onClick={clickSubmit}
            className="mt-3 btn btn-outline-primary"
          >
            Activate Account
          </button>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
