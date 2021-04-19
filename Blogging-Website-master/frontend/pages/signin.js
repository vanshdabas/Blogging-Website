import Layout from "../components/Layout";
import { withRouter } from "next/router";
import SigninComponent from "../components/auth/SigninComponent";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../config";
import Head from "next/head";

const Signin = ({ router }) => {
  const head = () => (
    <Head>
      <title>Tech Blogs | {APP_NAME}</title>
      <meta
        name="description"
        content="Tech Blogs and tutorials on web and mobile dev"
      />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Latest web dev tutorials | ${APP_NAME}`}
      />
      <meta
        property="og:description"
        content="Tech Blogs and tutorials on web and mobile dev"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/static/images/web.jpg`} />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/web.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showRedirectMessage = () => {
    if (router.query.message) {
      return <div className="alert alert-danger">{router.query.message}</div>;
    } else {
      return;
    }
  };

  return (
    <Layout>
      {head()}
      <h2 style={{ fontFamily: "Impact" }} className="text-center pt-4 pb-4">
        Signin
      </h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">{showRedirectMessage()}</div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Signin);
