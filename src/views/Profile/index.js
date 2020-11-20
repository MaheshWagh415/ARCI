import React, { Component, Fragment } from "react";
import { CardBody, CardHeader } from "reactstrap";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Row,
  Col
} from "reactstrap";
import UserProfile from "./userProfile";
import ChangePassword from "./changePassword";
import classnames from "classnames";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1"
    };
  }    
  toggle = panel => {
    this.setState({
      activeTab: panel
    });
  };
  render() {
    let { activeTab } = this.state;
    return (
      <Fragment>
        <Card>
          <CardHeader>User Dashboard</CardHeader>
          <CardBody className="profile">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    this.toggle("1");
                  }}
                >
                  Personal Details
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    this.toggle("2");
                  }}
                >
                  Reset Password
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <UserProfile />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <ChangePassword parentState={this.state} />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}
