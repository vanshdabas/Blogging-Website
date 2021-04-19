import Link from "next/link";
import { loginWithFacebook, authenticate, isAuth } from "../../actions/auth";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import FacebookLogin from "react-facebook-login";
import Router from "next/router";
import { FacebookLoginButton } from "react-social-login-buttons";
import { FACEBOOK_CLIENT_ID, API } from "../../config";

const LoginFacebook = () => {
  const responseFacebook = (response) => {
    console.log(response);
    const userID = response.userID;
    const accessToken = response.accessToken;
    console.log("fb", userID);
    loginWithFacebook({ userID, accessToken }).then((data) => {
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
    <div className="pb-2">
      <FacebookLogin
        autoLoad={false}
        callback={responseFacebook}
        appId={`${FACEBOOK_CLIENT_ID}`}
        autoLoad={false}
        fields="name,email,picture"
        cssClass="my-facebook-button-class"
        icon={
          <FacebookLoginButton
            className="fstyle"
            text="Login with FB"
            iconSize="25px"
            size="45px"
          />
        }
      />
      {/* <FacebookLogin
        appId={`${FACEBOOK_CLIENT_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className="btn btn-primary btn-lg btn-block"
          >
            <i className="fab fa-facebook pr-2"></i> Login with Facebook
          </button>
        )}
      /> */}
    </div>
  );
};

export default LoginFacebook;
