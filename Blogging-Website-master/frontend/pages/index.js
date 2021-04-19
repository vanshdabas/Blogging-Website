import Layout from "../components/Layout";
import Link from "next/link";
import Head from "next/head";
import { withRouter } from "next/router";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../config";

const Index = ({ router }) => {
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

  return (
    <Layout>
      {head()}
      <div className="landing">
        <h1
          style={{
            paddingTop: "12%",
            fontFamily: "Optima, sans-serif",
            fontSize: "55px",
          }}
          className="text-center"
        >
          Multi User Blogging Network
        </h1>
        <br />
        <p className="text-center font-italic" style={{ fontSize: "22px" }}>
          In a World of Technology, People Make the Difference.
        </p>
        <div
          className="text-center font-weight-bold"
          style={{ fontSize: "20px" }}
        >
          Made with{" "}
          <i
            style={{ color: "red", alignItems: "center" }}
            className="fas fa-heart fa-2x"
          />{" "}
          by Atul
        </div>
        <br />
        <div className="buttons text-center">
          <a href="/signup" className="btn btn-primary mr-2">
            Sign Up
          </a>
          <a href="/signin" className="btn btn-light">
            Login
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Index);
