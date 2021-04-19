import Layout from "../components/Layout";
import Link from "next/link";
import ContactForm from "../components/form/ContactForm";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../config";
import Head from "next/head";
import { withRouter } from "next/router";

const Contact = ({ router }) => {
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2 className="pt-4" style={{ fontFamily: "Impact" }}>
              Contact Form
            </h2>
            <hr />
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Contact);
