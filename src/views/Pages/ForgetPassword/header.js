import React, { Component, Fragment } from "react";
import { AppNavbarBrand } from "@coreui/react";
import logo from "../../../assets/img/brand/logo.svg";
export default class Header extends Component {
  render() {
    return (
      <Fragment>
        <header className="app-header navbar">
          <AppNavbarBrand
            full={{ src: logo, width: 89, height: "70%", alt: "Yash Logo" }}
            minimized={{
              src: logo,
              width: 30,
              height: "50%",
              alt: "Yash Logo"
            }}
          />
          <span className="customHeader">ARCI</span>
        </header>
      </Fragment>
    );
  }
}
