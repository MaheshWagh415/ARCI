import React, { Component, Fragment } from "react";
import { Row, Col, Label, Input, Alert, Button } from "reactstrap";
import * as Validator from "../validator";
import { bindActionCreators } from "redux";
import { UncontrolledTooltip  } from 'reactstrap';
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      currentPasswordError: null,
      newPasswordError: null
    };
  }
  resetState = () => {
    this.setState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      currentPasswordError: null,
      newPasswordError: null
    });
  };
  handleChange = e => {
    let name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  };
  componentDidUpdate(prevProps, prevState) {
    let { passwordStatus } = this.props;
    if (
      prevProps.passwordStatus != this.props.passwordStatus &&
      passwordStatus &&
      passwordStatus.response &&
      passwordStatus.response.status == 500
    ) {
      this.setState({
        apiError: passwordStatus.response.data.message,
        apiSuccess: null
      });
    } else if (
      prevProps.passwordStatus != this.props.passwordStatus &&
      passwordStatus.status == 200
    ) {
      this.setState({
        apiSuccess: "Password Updated Successfully.",
        apiError: null,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } else if (
      prevProps != this.props &&
      this.props.parentState.activeTab === "1"
    ) {
      this.resetState();
    }
  }
  // formSubmit = () => {
  //   let { newPassword, confirmPassword, currentPassword } = this.state;
  //   let currentPasswordFlag, newPasswordFlag, confirmPasswordFlag;
  //   currentPasswordFlag = Validator.checkEmpty(
  //     currentPassword,
  //     "Current Password"
  //   );
  //   newPasswordFlag = Validator.checkEmpty(newPassword, "New Password");
  //   confirmPasswordFlag = Validator.checkEmpty(
  //     confirmPassword,
  //     "Confirm Password"
  //   );
  //   !confirmPasswordFlag &&
  //     (confirmPasswordFlag = Validator.checkEqual(
  //       newPassword,
  //       confirmPassword
  //     ));
  //   if (currentPasswordFlag || newPasswordFlag || confirmPasswordFlag) {
  //     this.setState({
  //       currentPasswordError: currentPasswordFlag,
  //       newPasswordError: newPasswordFlag,
  //       confirmPasswordError: confirmPasswordFlag
  //     });
  //   } else {
  //     this.setState({
  //       currentPasswordError: null,
  //       newPasswordError: null,
  //       confirmPasswordError: null
  //     });

  //   }
  // };
  validateField = parm => {
    let { currentPassword, newPassword, confirmPassword } = this.state;
    let currentPasswordFlag, newPasswordFlag, confirmPasswordFlag;
    if (parm == "currentPassword" || parm == "all") {
      currentPasswordFlag = Validator.checkEmpty(
        currentPassword,
        "Current Password"
      );
      if(currentPasswordFlag === false)
      {
        currentPasswordFlag = Validator.validatePassword( currentPassword );
      }
    }
    if (parm == "newPassword" || parm == "all") {
      newPasswordFlag = Validator.checkEmpty(newPassword, "New Password");
      if(newPasswordFlag === false)
      {
        newPasswordFlag = Validator.validatePassword( newPassword );
    }}
    
    if (parm == "confirmPassword" || parm == "all") {
      confirmPasswordFlag = Validator.checkEmpty(
        confirmPassword,
        "Confirm Password"
      );
      if(confirmPasswordFlag === false)
      {
        confirmPasswordFlag = Validator.validatePassword( confirmPassword );
      }
      !confirmPasswordFlag &&
        (confirmPasswordFlag = Validator.checkEqual(
          newPassword,
          confirmPassword
        ));
    }

    if (currentPasswordFlag || newPasswordFlag || confirmPasswordFlag) {
      this.setState({
        currentPasswordError: currentPasswordFlag,
        newPasswordError: newPasswordFlag,
        confirmPasswordError: confirmPasswordFlag
      });
    } else {
      this.setState({
        currentPasswordError: null,
        newPasswordError: null,
        confirmPasswordError: null
      });
    }
    if (
      parm == "all" &&
      !currentPasswordFlag &&
      !newPasswordFlag &&
      !confirmPasswordFlag
    ) {
      let { accessToken, tokenType } = this.props.userSession;
      let data = {
        oldPassword: currentPassword,
        password: confirmPassword,
        accessToken,
        tokenType
      };
      this.props.changePasswordAction(data);
      console.log("Make api call", data);
    }
  };
  render() {
    let {
      currentPassword,
      currentPasswordError,
      newPassword,
      newPasswordError,
      confirmPassword,
      confirmPasswordError,
      apiError,
      apiSuccess
    } = this.state;
    return (
      <Fragment>
        <Row className="justify-content-center">
          <Col md="4">
            <Label for="currentPassword">Current Password</Label>
            <Input
              type="password" 
              name="currentPassword"
              value={currentPassword}
              onChange={e => {
                this.handleChange(e);
              }}
              onBlur={this.validateField.bind(this, "currentPassword")}
            />
            {currentPasswordError && (
              <Alert color="danger">{currentPasswordError}</Alert>
            )}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="4">
            <Label for="newPassword">New Password</Label>
            <Input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={e => {
                this.handleChange(e);
              }}
              onBlur={this.validateField.bind(this, "newPassword")}
            />
             <span style={{textDecoration: "underline", color:"black",marginTop: "-13%",
             position: "absolute", marginLeft: "93%"}} href="#" id="helpMessage">
            <i className="fa fa-question-circle" aria-hidden="true"></i>
            </span>
            <UncontrolledTooltip placement="right" target="helpMessage">
            Your password must be at least 6 characters long and include a character and a number.
            </UncontrolledTooltip>

            {newPasswordError && (
              <Alert color="danger">{newPasswordError}</Alert>
            )}  
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="4">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={e => {
                this.handleChange(e);
              }}
              onBlur={this.validateField.bind(this, "confirmPassword")}
            />
            {confirmPasswordError && (
              <Alert color="danger">{confirmPasswordError}</Alert>
            )}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm="4" className="text-center">
            <Button
              color="primary"
              //  onClick={this.formSubmit}
              onClick={this.validateField.bind(this, "all")}
              className="btnUpdate"
            >
              Reset Password
            </Button>
            {apiError && <Alert color="danger">{apiError}</Alert>}
            {apiSuccess && <Alert color="success">{apiSuccess}</Alert>}
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export const mapStateToProps = state => {
  return {
    userSession: state.session.user,
    passwordStatus: state.userReducer.changePasswordRes
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassword);
