import React, { useState } from "react";
import Router, { withRouter } from "next/router";
import { router } from "next/router";
import NProgress from "nprogress";
import { APP_NAME } from "../config";
import { signout, isAuth } from "../actions/auth";
import Link from "next/link";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Search from "./blog/Search";
import ".././node_modules/nprogress/nprogress.css";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = ({ router }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hideSearchBar = () => {
    if (
      router.pathname === "/signin" ||
      router.pathname === "/signup" ||
      router.pathname === "/" ||
      router.pathname === "/admin" ||
      router.pathname === "/user" ||
      router.pathname === "/admin/crud/blog" ||
      router.pathname === "/admin/crud/category-tag" ||
      router.pathname === "/user/update" ||
      router.pathname === "/user/crud/blog" ||
      router.pathname === "/contact" ||
      router.pathname === "/auth/password/forgot" ||
      router.pathname === `/auth/password/reset/[id]` ||
      router.pathname === `/auth/account/activate/[id]` ||
      router.pathname === `/blogs/[slug]` ||
      router.pathname === `/profile/[username]`
    ) {
      return null;
    } else {
      return <Search />;
    }
  };

  const toggle = () => setIsOpen(!isOpen);
  return (
    <React.Fragment>
      <Navbar
        style={{ backgroundColor: "#e3f2fd" }}
        className="navbar navbar-light"
        // color="light"
        // light
        expand="md"
      >
        <Link href="/">
          <i
            style={{ color: "red", cursor: "pointer" }}
            className="fab fa-blogger fa-2x"
          />
        </Link>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <React.Fragment>
              <NavItem>
                <Link href="/blogs">
                  <NavLink style={{ cursor: "pointer" }}>Blogs</NavLink>
                </Link>
              </NavItem>

              <NavItem>
                <Link href="/contact">
                  <NavLink style={{ cursor: "pointer" }}>Contact</NavLink>
                </Link>
              </NavItem>
            </React.Fragment>

            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signin">
                    <NavLink style={{ cursor: "pointer" }}>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{ cursor: "pointer" }}>Signup</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user">
                  <NavLink style={{ cursor: "pointer" }}>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}

            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin">
                  <NavLink style={{ cursor: "pointer" }}>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && (
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  onClick={() => signout(() => Router.push(`/signin`))}
                >
                  Signout
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <a
                href="/user/crud/blog"
                className="btn btn-primary text-light"
                style={{ cursor: "pointer" }}
              >
                Create Blog
              </a>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      {hideSearchBar()}
    </React.Fragment>
  );
};

export default withRouter(Header);
