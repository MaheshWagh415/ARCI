import React, { Component, Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  FormFeedback,
  Alert
} from "reactstrap";
import * as constants from "../../../constants";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { AppFooter } from "@coreui/react";
import { forgotPasswordAction } from "./../../../redux/actions/home";
import Popup from "./Popup";
const DefaultHeader = React.lazy(() => import("./header"));
const DefaultFooter = React.lazy(() =>
  import("../../../containers/Layout/Footer")
);

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      message: "",
      status: null,
      //employeeId:"",
      redirect: false,
      invalidEmail: false,
      error: "none"
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.closeSucess = this.closeSucess.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    let email = this.state.email.includes("@");
    let temp = this.state.email.includes("yash.com");

    if (this.state.email === "" || email === false) {
      this.setState({
        invalidEmail: true
      });
    } else {
      var data = {
        emailId: this.state.email
        //employeeId:this.state.employeeId
      };

      axios
        .post(constants.BASE_URL + "/api/auth/v1/initiateResetPassword", data)
        .then(res => {        
          if (res.status === 200) {
            this.setState({
              message:
                "Password reset process has been started, Please check your email.",
              status: 200
            });
          }
        })
        .catch(error => {
          if (error.response.status === 403) {             
              this.setState({
                message:
                 error.response.data.message,
                status: 403
              });            
          }
          else {
            this.setState({
              redirect: true,
              message:
              error.response.data.message,
              status: error.response.data.status
            });
          }
         
        });
    }
  }

  closeSucess = () => {
    if (this.state.status == 200) {
      this.props.history.push("/login");
    }
    this.setState({
      message: null,
      status: null
    });
  };
  render() {  
    return (
      <Fragment>
        <DefaultHeader />
        <div className="app flex-row align-items-center">
          {this.state.status && (
            <Popup
              close={this.closeSucess}
              message={this.state.message}
              status={this.state.status}
            />
          )}
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup
                  style={{
                    width: "60%",
                    marginLeft: "18%",
                    marginBottom: "15%"
                  }}
                >
                  <Card className="p-4">
                    <CardBody>
                      <Form onSubmit={this.onSubmit}>
                        <h1>Forgot Password</h1>
                        <p className="text-muted">Enter Email Address</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Email"
                            autoComplete="email"
                            invalid={this.state.invalidEmail}
                            value={this.state.email}
                            onChange={event => {
                              this.setState({
                                email: event.target.value,
                                invalidEmail: false,
                                error: "none"
                              });
                            }}
                          />
                          <FormFeedback
                            invalid={this.state.invalidEmail.toString()}
                          >
                            Please enter valid email
                          </FormFeedback>
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4">
                              Reset Password
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
        <AppFooter className="customFooter">
          <DefaultFooter />
        </AppFooter>
      </Fragment>
    );
  }
}
export const mapStateToProps = state => {
  return {
    userSession: state.session.user
  };
};

export default connect(mapStateToProps)(ForgetPassword);
