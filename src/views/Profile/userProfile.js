import React, { Component, Fragment } from "react";
import * as Validator from "../validator";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionCreators } from "../../redux/actions";
import * as constants from '../../constants'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Row, Col, Input, Alert, Label } from "reactstrap";
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      //   lastName: "Sharma",
      //   phoneNo: "",
      //   email: "rohit.sharma@yash.com",
      //   newPassword: "",
      //   confirmPassword: "",
      //   phoneNoError: null,
      //   newPasswordError: null,
      //   confirmPasswordError: null,
      //   apiError: null,
      //   apiSuccess: null,
      //   userProfile: null
      // 
      accessToken: "",
      tokenType: "",
      userProfile: "",
      skills:[],
      userdata:{}
    };
  }
  handleChange = e => {
    let name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  };
  formSubmit = () => {
    let { phoneNo, newPassword, confirmPassword } = this.state;
    let phoneNoFlag, newPasswordFlag, confirmPasswordFlag;
    phoneNoFlag = Validator.checkEmpty(phoneNo, "Phone No");
    !phoneNoFlag && (phoneNoFlag = Validator.validatePhone(phoneNo));
    newPasswordFlag = Validator.checkEmpty(newPassword, "New Password");
    confirmPasswordFlag = Validator.checkEmpty(
      confirmPassword,
      "Confirm Password"
    );
    !confirmPasswordFlag &&
      (confirmPasswordFlag = Validator.checkEqual(
        newPassword,
        confirmPassword
      ));
    if (phoneNoFlag || newPasswordFlag || confirmPasswordFlag) {
      this.setState({
        phoneNoError: phoneNoFlag,
        newPasswordError: newPasswordFlag,
        confirmPasswordError: confirmPasswordFlag
      });
    } else {
      this.setState({
        phoneNoError: null,
        newPasswordError: null,
        confirmPasswordError: null
      });
      console.log("Make API call.");
    }
  };

  selectedProfile = e => {
  this.setState({
    userdata: e.target.value
  });
  };
  validateField = parm => {
    let obj ={};
    if(Object.keys(this.state.userdata).length >0){
        let k = this.state.userdata.split(" ");
        obj.skillId=Number(k[0]);
        obj.skills=k[1];
      }else{
          obj.skillId=this.state.userProfile.skill.id;
          obj.skills=this.state.userProfile.skill.skillName;
        }
    axios
    .put(
        constants.BASE_URL + `/api/users/updateUserProfile/`, 
        obj, 
        {headers: {
          Authorization: this.state.tokenType + " " + this.state.accessToken
        }}
    )
    .then(r =>{
      toast.success("Profile Updated Successfully", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    })
    .catch(e => {
      toast.error("Profile Not Updated Uuccessfully", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    });
  };
  componentDidMount() {

    let { accessToken, tokenType } = this.props.userSession;

    this.setState({
      accessToken: accessToken,
      tokenType: tokenType
    },
      () => {

        // console.log("console****", this.props.userSession.accessToken);
        let url = constants.BASE_URL + "/api/users/userInfo/";
        axios
          .get(url, {
            headers: {
              Authorization: this.state.tokenType + " " + this.state.accessToken
            }
          })
          .then(res => {
            // console.log("response user***********",accessToken);

            this.setState({
              userProfile: res.data,

            })
            console.log(this.state.userProfile)

          })
          .catch(error => {
            console.log("error ==>", error);
          });

      });
          axios
              .get(constants.BASE_URL + '/skills/all').then(res => {
                let skillsFromApi = [];
                res.data.map(d => {
                  skillsFromApi.push({ id: d.id, skillName: d.skillName });
                });
                console.log(skillsFromApi);
                this.setState({
                  skills: skillsFromApi,         
                });
      });
  }
  render() {
    let {
      employeeId,
      firstName,
      lastName,
      email,
      phoneNo,
      skill = {},
      apiError,
      apiSuccess,

    } = this.state.userProfile;
    return (
      <Fragment>
        <Row className="justify-content-center">
          {/* <Col md="4">
            <img
              src="/static/media/logo.0d1ec61e.svg"
              className="userImg"
            ></img>
            
          </Col> */}

          <Col md="6">
            <Row className="justify-content-center">

              <Col md="4">
                <Label for="employeeId">Employee ID</Label>
                <Input
                  type="text"
                  placeholder="Employee Id"

                  value={employeeId}
                  disabled
                />
              </Col>

              <Col md="4">
                <Label for="fName">First Name</Label>
                <Input
                  type="text"
                  placeholder="First Name"

                  value={firstName}
                  disabled
                />

              </Col>
              <Col md="4">
                <Label for="lName">Last Name</Label>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  disabled
                />
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <Label for="email">E-mail Address</Label>
                <Input type="text" placeholder="Email" value={email} disabled />
              </Col>
              <Col md="6"><Label for="phoneNo">Competency</Label>
                <select
                  className="form-control"
                  onChange={this.selectedProfile}
                >
          <option value={skill.id +" "+ skill.skillName } >{skill.skillName}</option>
                          {this.state.skills.map((value, key) => {
                            if(skill.id!=value.id){
                          return (
                          <option key={key} value={value.id +" "+ value.skillName } >
                          {value.skillName}
                          </option>
                          );
                            }
                          })}
                </select>
              </Col>
            </Row>
            <Row>
              <Col
                // sm={{ size: "auto", offset: 9 }}
                className="text-center"
              >
                <Button
                  color="primary"
                  // onClick={this.formSubmit}                  
                  onClick={this.validateField.bind(this, "all")}
                >
                  Update Profile
                </Button>
                {apiError && <Alert color="danger">{apiError}</Alert>}
                {apiSuccess && <Alert color="success">{apiSuccess}</Alert>}
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>

    );
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
function mapStateToProps(state) {
  return {
    pastData: state.pastData,
    userSession: state.session.user
  };

}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);