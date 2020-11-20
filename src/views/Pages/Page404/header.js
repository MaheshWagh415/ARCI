import React, { Component, Fragment } from "react";
import { AppNavbarBrand } from "@coreui/react";
import logo from "../../../assets/img/brand/logo.svg";
import { Link } from 'react-router-dom';
export default class Header extends Component {
  render() {
    return (
      <Fragment>
        <header className="app-header navbar">
          <Link to="/">
          <AppNavbarBrand
            full={{ src: logo, width: 89, height: "70%", alt: "Yash Logo" }}
            minimized={{
              src: logo,
              width: 30,
              height: "50%",
              alt: "Yash Logo"
            }}
          />
          </Link>
          <span className="customHeader"><Link
                  to="/"
                  activeClassName="active"
                  style={{
                    fontWeight: "900",
                    fontSize: "24px",
                    marginLeft: "1%",
                    color: "#005BA1"
                  }}
                  >ARCI</Link></span>
        </header>
      </Fragment>
    );
  }
}
