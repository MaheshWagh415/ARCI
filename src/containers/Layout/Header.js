import React, { Component } from "react";
import {
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav
} from "reactstrap";
import PropTypes from "prop-types";
import { Row } from "reactstrap";
import Notifications from './Notifications';

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import logo from "../../assets/img/brand/logo.svg";
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';
import { ActionCreators } from "../../redux/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sessionService } from "redux-react-session";

import * as constants from "../../constants";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor() {
    super();
    this.state = {
      accessToken: "",
      tokenType: "",
      firstName: "",
      lastName: "",
      roleName: [],
      userRole: null
    };
  }

  componentDidMount() {
    let { accessToken, tokenType, firstName, lastName, roleName } = this.props.userSession;
    this.setState({
      accessToken: accessToken,
      tokenType: tokenType,
      firstName: firstName,
      lastName: lastName,
      roleName: roleName,
      userRole: roleName[0]
    }, () => {
      this.props.userType(this.state.userRole)
    });
  }

  goToProfile = () => {
    this.props.history.push("/user-profile");
  };

  async toggleRoles(index, role) {
    let role_0 = this.state.roleName[0]    
    this.state.roleName[index] = role_0;
    this.state.roleName[0] = role;
    // this.forceUpdate()    
    const token = {
      accessToken: this.state.accessToken,
      tokenType: this.state.tokenType,
      roleName: this.state.roleName,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };
    this.setState({
      userRole: role
    }, () => {
      this.props.userType(role)
    })
    
    // await sessionService.deleteSession();
    // await sessionService.saveSession(token);
    // await sessionService.deleteUser();
    // await sessionService.saveUser(token);
    window.location.assign(constants.CLIENT_BASE_URL);
  }

  render() {
    const { children, ...attributes } = this.props;
    let { userRole } = this.state;
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <Link to="/">
          <AppNavbarBrand
            full={{ src: logo, width: 89, height: "70%", alt: "Yash Logo" }}
            minimized={{ src: logo, width: 30, height: "50%", alt: "Yash Logo" }}
          />
        </Link>
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Link
          to="/"
          activeClassName="active"
          style={{
            fontWeight: "900",
            fontSize: "24px",
            marginLeft: "1%",
            color: "#005BA1"
          }}
        >ARCI</Link>

        <Nav style={{marginRight: "1.5%"}} className="ml-auto" navbar>
          {/* {(this.state.roleName.indexOf("ROLE_USER") == 0) && <Notifications />} */}
          {this.state.userRole == "ROLE_USER" && <Notifications />}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <Row className="text-center" style={{ marginLeft: "-25%" }}>
                <span>Welcome, {this.state.firstName} {this.state.lastName}</span>
                <i
                  className="icon-arrow-down icons d-block"
                  style={{ fontSize: "1.0rem !important", margin: "1.5%" }}
                ></i>
              </Row>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={this.goToProfile}>
                <i className="fa fa-user"></i> Profile
              </DropdownItem>

              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i className="fa fa-lock"></i> Logout
              </DropdownItem>
              {
                this.state.roleName.map((roleName, index) => {
                  let role  = roleName.replace(/ROLE_/g, "");
                  if (index > 0) {
                     role = roleName;
                     role = (role.substring(role.indexOf('_') + 1)).toLowerCase();
                     role = role.charAt(0).toUpperCase() + role.slice(1);
                    return <DropdownItem value={index} onClick={e => this.toggleRoles(e.target.value, roleName)}>
                      <i className="icon-user"></i> Login as {roleName != userRole && role}
                    </DropdownItem>
                  }
                })}

            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    userSession: state.session.user
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)
  (DefaultHeader));