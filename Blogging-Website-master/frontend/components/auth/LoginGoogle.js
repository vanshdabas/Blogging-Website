import Link from "next/link";
import { useState, useEffect } from "react";
import { loginWithGoogle, authenticate, isAuth } from "../../actions/auth";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";
import { GOOGLE_CLIENT_ID } from "../../config";
import GoogleLogin from "react-google-login";
import Router from "next/router";

const LoginGoogle = () => {
  const responseGoogle = (response) => {
    // console.log(response);
    const tokenId = response.tokenId;
    const user = { tokenId };
    loginWithGoogle(user).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
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

  return (
    <div className="pb-4">
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        theme="dark"
      />
    </div>
  );
};

export default LoginGoogle;
