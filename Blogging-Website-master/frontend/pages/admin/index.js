import Layout from "../../components/Layout";
import Link from "next/link";
import Admin from "../../components/auth/Admin";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import { withRouter } from "next/router";
import Head from "next/head";

const AdminIndex = ({ router }) => {
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
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-4 pb-5">
              <h2 style={{ fontFamily: "Impact" }}>Admin Dashboard</h2>
            </div>
            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="admin/crud/category-tag">
                    <a>Create Category/Tag</a>
                  </Link>
                </li>

                <li className="list-group-item">
                  <a href="admin/crud/blog">Create Blog</a>
                </li>

                <li className="list-group-item">
                  <Link href="admin/crud/blogs">
                    <a>Update/Delete Blogs</a>
                  </Link>
                </li>

                <li className="list-group-item">
                  <Link href="user/update">
                    <a>Update Profile</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-8">.</div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default withRouter(AdminIndex);
