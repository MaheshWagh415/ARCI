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
import axios from "axios";
import { sessionService } from "redux-react-session";
import * as constants from "../../../constants";
import { AppFooter } from "@coreui/react";
import { Link } from 'react-router-dom'
const DefaultHeader = React.lazy(() => import("./header"));
const DefaultFooter = React.lazy(() =>
  import("../../../containers/Layout/Footer")
);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidPassword: false,
      invalidUsername: false,

      username: "",
      password: "",
      error: "none",
      errorMessage:""
    };
  }


  loginBtn = async event => {
    event.preventDefault();

    if (this.state.username === "" || this.state.password === "") {
      this.setState({
        invalidUsername: this.state.username === "" ? true : false,
        invalidPassword: this.state.password === "" ? true : false
      });
    } else {
      const user = {
        username: this.state.username,
        password: this.state.password
      };
      

      axios
        .post(constants.BASE_URL + "/api/auth/signin", user)
        .then(res => {
          if (res.status === 200) {
            const token = res.data;
            sessionService.saveSession({ token });
            sessionService.saveUser(token);

            setTimeout(() => {
              if (token.roleName[0] === "ROLE_USER")
                this.props.history.replace("/statistics");
              else if (token.roleName[0] === "ROLE_ADMIN")
                this.props.history.replace("/dashboard");
                else if (token.roleName[0] === "ROLE_ASSOCIATE")
                this.props.history.replace("/"); 
                else 
                this.props.history.replace("/login");
            }, 500);
          } else {
            console.log(res.data.message);
          }
        })
        .catch(error => {
          this.setState({ error : "" ,
                          errorMessage : Object.getOwnPropertyDescriptor(error, 'message').value});
          if (error.response) {
            this.setState({
              errorMessage:error.response.data.message
            });
          } else console.log("Connection Refused by Server..!!");
        });
    }
  };

  render() {
    return (
      <Fragment>
        <DefaultHeader />
        <div className="app flex-row align-items-center">

          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup style={{ width: "60%", marginLeft: "18%", marginBottom: "15%" }}>

                  <Card className="p-4">

                    <CardBody>
                      <Alert color="danger" style={{ display: this.state.error }}>
                        {this.state.errorMessage}
                 </Alert>
                      <Form onSubmit={this.loginBtn}>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input invalid={this.state.invalidUsername} type="text"
                            placeholder="Username" autoComplete="username"

                            value={this.state.username} onChange={(event) => {
                              this.setState({
                                username: event.target.value,
                                invalidUsername: false,
                                error: 'none'
                              })
                            }}
                          />

                          <FormFeedback invalid="true">Please enter valid username</FormFeedback>
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input invalid={this.state.invalidPassword} type="password"
                            placeholder="Password" autoComplete="current-password"

                            value={this.state.password} onChange={(event) => {
                              this.setState({
                                password: event.target.value,
                                invalidPassword: false,
                                error: 'none'
                              })
                            }}
                          />
                          <FormFeedback invalid="true">Please enter valid password</FormFeedback>
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4">Login</Button>
                          </Col>
                          <Link to="register" color="link" style={{position: "absolute", marginLeft: "27%"}} className="px-0">Register here</Link>
                          <Col xs="6" className="text-right">
                            <Link to="forgetpassword" color="link" className="px-0">Forgot password?</Link>
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

export default Login;
