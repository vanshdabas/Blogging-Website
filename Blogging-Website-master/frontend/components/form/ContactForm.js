import { useState } from "react";
import Link from "next/link";
import { emailContactForm } from "../../actions/form";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

const ContactForm = ({ authorEmail }) => {
  const [values, setValues] = useState({
    message: "",
    name: "",
    email: "",
    sent: false,
    buttonText: "Send Message",
    success: false,
    error: false,
  });

  const { message, name, email, sent, buttonText, success, error } = values;

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Sending..." });
    emailContactForm({ authorEmail, name, email, message }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
        toast.error(data.error);
      } else {
        setValues({
          ...values,
          sent: true,
          name: "",
          email: "",
          message: "",
          buttonText: "Sent",
          success: data.success,
        });
        toast.success("Thank you for contacting us.");
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: false,
      success: false,
      buttonText: "Send Message",
    });
  };

  //   const showSuccessMessage = () => success && ()

  const contactForm = () => {
    return (
      <form className="pb-5" onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="lead">Name</label>
          <input
            type="text"
            onChange={handleChange("name")}
            className="form-control"
            value={name}
            // required
          />
        </div>
        <div className="form-group">
          <label className="lead">Email</label>
          <input
            type="email"
            onChange={handleChange("email")}
            className="form-control"
            value={email}
            // required
          />
        </div>
        <div className="form-group">
          <label className="lead">Message</label>
          <textarea
            onChange={handleChange("message")}
            type="text"
            className="form-control"
            value={message}
            // required
            rows="10"
          />
        </div>

        <div>
          <button className="btn btn-primary">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      <ToastContainer />
      {contactForm()}
    </React.Fragment>
  );
};

export default ContactForm;
