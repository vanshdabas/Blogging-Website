// const withCSS = require("@zeit/next-css");
const withStyles = require("@webdeb/next-styles");
const withSass = require("@zeit/next-sass");

const withImages = require("next-images");
// module.exports = withImages();

module.exports = withStyles({
  publicRuntimeConfig: {
    APP_NAME: "BLOG",
    API_DEVELOPMENT: "http://localhost:8000/api",
    API_PRODUCTION: "https://user-blog-platform-api.herokuapp.com/api",
    PRODUCTION: true,
    modules: true,
    DOMAIN_DEVELOPMENT: "http://localhost:3000",
    DOMAIN_PRODUCTION: "https://blog.com",
    FB_APP_ID: "957972861292768",
    DISQUS_SHORTNAME: "blog-platform-1",
    GOOGLE_CLIENT_ID:
      "1094679444284-5stevjjs974o2n319ii87f8r9a539fas.apps.googleusercontent.com",
    FACEBOOK_CLIENT_ID: "754617985341778",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      loader: "file-loader",
      options: {
        outputPath: "static",
      },
    });
    return config;
  },
});
