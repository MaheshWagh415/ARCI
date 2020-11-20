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
import Popup from "./Popup";
import { AppFooter } from "@coreui/react";
const DefaultHeader = React.lazy(() => import("../ForgetPassword/header"));
const DefaultFooter = React.lazy(() =>
  import("../../../containers/Layout/Footer")
);

export default class ConfirmRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUpMessage: "no msg",
      showPopUp: false,
      status:200,
      redirectLoginFlag:false
    };
  }
  closePopUp= ()=>{
    this.setState({
      showPopUp:false
    });
    this.props.history.push("/login");
  }
  componentDidMount() {
    let token = this.props.match.params.token;
    console.log("in did mount and token is " + token);
    axios
      .get(
        constants.BASE_URL +
          "/api/auth/signup/confirm-registration?token=" +
          token
      )
      .then(res => {
        debugger;
        console.log(res);
        this.setState({
          showPopUp: true,
          popUpMessage: res.data,
          status : 200,
          redirectLoginFlag: true
        });
      })
      .catch(error => {
        this.setState({
          showPopUp: true,
          popUpMessage: error.response.data.message,
          status: error.response.data.status,
          redirectLoginFlag:true
        });
        
      });
  }

  render() {
    return (
      <Fragment>
        <DefaultHeader />

        <div className="app flex-row align-items-center">
          {this.state.showPopUp && <Popup message={this.state.popUpMessage} status={this.state.status} closePopUp={this.closePopUp} redirectToLogin={this.state.redirectLoginFlag} />}
        </div>
        <AppFooter className="customFooter">
          <DefaultFooter />
        </AppFooter>
      </Fragment>
    );
  }
}
