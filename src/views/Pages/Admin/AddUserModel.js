import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, FormGroup, Label,
  InputGroupAddon, InputGroupText, Row, FormFeedback, Dropdown, DropdownMenu, DropdownToggle, DropdownItem
}
  from 'reactstrap';
import { Button } from 'react-bootstrap';
import axios from "axios";
import * as constants from '../../../constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import { bindActionCreators } from "redux";
class AddUserModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: true,
      invalidUsername: false,
      invalidPassword: false,
      invalidEmployeeId: false,
      invalidFirstName: false,
      invalidLastName: false,
      invalidEmail: false,
      invalidRole: false,
      invalidSkill: false,
      username: '',
      password: '',
      EmployeeId: '',
      FirstName: '',
      LastName: '',
      Email: '',
      emailValidMsg: 'Please enter valid email address',
      skillId: '',
      error: 'none',
      selectedRoles: [],
      skills: [],
      roles: [],
      successMsg: "",
      isActive: true,
      dropDownValue: 'Select Skill',
      dropDownValueRoles: 'Select Role',
      dropDownSkills: false,
      dropDownRoles: false
    };
    this.toggle = this.toggle.bind(this);
    this.toggleRoles = this.toggleRoles.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeValueRole = this.changeValueRole.bind(this);
    this.rolesShow = this.rolesShow.bind(this);
    this.showRoles = this.showRoles.bind(this);
    this.closeModal = this.closeModal.bind(this);

  }
  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.close();
  };
  toggle(event) {
    this.setState({
      dropDownSkills: !this.state.dropDownSkills
    });
  }
  toggleRoles(event) {
    this.setState({
      dropDownRoles: !this.state.dropDownRoles
    });
  }

  changeValue(e) {
    this.setState({
      dropDownValue: e.currentTarget.textContent,
      skillId: e.currentTarget.getAttribute("id")
    });

    console.log(e.currentTarget.getAttribute("id"));
  }
  changeValueRole(event) {

    const selectedRoles = this.state.selectedRoles;
    if (event.target.checked) {
      var role = {
        id: event.target.id,
        name: event.target.name
      }

      this.setState({
        selectedRoles: [...selectedRoles, role],
        invalidRole: false
      })
    }
    else if (event.target.checked === false) {
      var newRoles = selectedRoles.filter(function (role, index) {
        return (role.id !== event.target.id);
      })
      this.setState({ selectedRoles: newRoles })
    }
  }

  componentDidMount() {
        let data = {
      tokenType: this.props.userSession.tokenType,
      accessToken : this.props.userSession.accessToken
    }
   
    this.setState({
      token:data
    })
    this.props.getUsersForAdmin(data);
    axios
      .get(constants.BASE_URL + '/skills/all', {
        headers: {
          Authorization: this.props.tokenData.tokenType + " " + this.props.tokenData.accessToken,
          ContentType: "application/json"
        }
      }).then(res => {
        let skillsFromApi = [];
        this.setState({
          skills: res.data,
        });
      });

    axios
      .get(constants.BASE_URL + '/admin/roles', {
        headers: {
          Authorization: this.props.tokenData.tokenType + " " + this.props.tokenData.accessToken,
          ContentType: "application/json"
        }
      }).then(res => {
        let roles = [];
        res.data.map(d => {
          roles.push({ id: d.id, name: d.name });
        });
        this.setState({
          roles: roles,
        });
      });
       this.componentDidUpdate();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.users && this.props.users.status) {
      let { data, status } = this.props.users;
      if (prevProps != this.props && status === 200) {
        let tempData = [];
        data.map((data, index) => {
          tempData.push({ ...data, index: ++index });
        });
        this.setState(
          {
            users: tempData
          });
      }
    }
  }
  rolesShow() {
    if (this.state.selectedRoles.length === 0) {
      console.log(this.state.dropDownValueRoles);
      return this.state.dropDownValueRoles
    }
    else {
      var roles = ""
      this.state.selectedRoles.map((role, index) => {
        if (index === 0) { roles = roles + role.name }
        else { roles = roles + ", " + role.name }
      })
      return roles
    }
  }
  showRoles(roleName) {
    return roleName.substring(roleName.indexOf('_') + 1)
  }


  registerBtn = async (event) => {
    event.preventDefault();
    const users = this.props.users;
    if (this.state.username === '' || this.state.password === '' || this.state.FirstName === '' || this.state.LastName === '' || this.state.Email === '' || this.state.EmployeeId === '' || !this.state.Email.includes('@') || this.state.skillId === '' || this.state.selectedRoles.length === 0) {
      this.setState({
        invalidUsername: this.state.username === '' ? true : false,
        invalidPassword: this.state.password === '' ? true : false,
        invalidEmployeeId: this.state.EmployeeId === '' ? true : false,
        invalidFirstName: this.state.FirstName === '' ? true : false,
        invalidLastName: this.state.LastName === '' ? true : false,
        invalidEmail: this.state.Email === '' || !this.state.Email.includes('@') || !this.state.Email.includes('.com') ? true : false,
        invalidRole: this.state.selectedRoles.length === 0 ? true : false,
        invalidSkill: this.state.skillId === '' ? true : false

      });
    }
    else {

      const skill = {
        id: this.state.skillId
      };
      const roles = this.state.selectedRoles
      const user = {
        username: this.state.username,
        password: this.state.password,
        employeeId: this.state.EmployeeId,
        firstName: this.state.FirstName,
        lastName: this.state.LastName,
        email: this.state.Email,
        skills: skill,
        roles: roles,
        isActive: true
      };
      console.log(user)
      var successMsg = "";
      await axios.post(constants.BASE_URL + '/admin/user', user,
        {
          headers: {
            Authorization: this.props.tokenData.tokenType + " " + this.props.tokenData.accessToken,
            ContentType: "application/json"
          }
        })
        .then(res => {
          if (res.status === 200) {
            users.push(user);
            this.setState({
              users
            })
            this.componentDidMount();
            successMsg = "User Added Successfully!";
            this.notify(successMsg);
            this.closeModal();
          }
        }).catch((error) => {
          this.setState({ error: '' });
          if (error.response) {
            if (error.response.data.message === "No value present") {
              successMsg = "Please select atleast one skill.";
              this.notify(successMsg);
            }
            else {
              successMsg = error.response.data.message
              this.notify(successMsg);
              console.log(error.response.data.message)
            }

          }
          else
            console.log('Connection Refused by Server..!!')
        });


      console.log(successMsg)

    }


  }


  notify = (successMsg) => toast.success(successMsg, { hideProgressBar: true });

  render() {
    let { open } = this.state;
    const message = this.props.message;
    if (this.state.open === false) {
      return <Redirect to='/admin/users' />
    }
    return (
      <div className="app flex-row align-items-center">

        <Modal isOpen={open} toggle={this.closeModal}>
          <ToastContainer position="bottom-right"
            autoClose={2000}
            hideProgressBar
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
          <ModalBody className="userModel">

            <Row className="justify-content-center">
              <Col md="12" lg="12" xl="12">
                <Card className="userModelCard">
                  <CardBody className="p-4 cardBody">
                    <Form>
                      <h1>Add User</h1>
                      <p className="text-muted"><span color="danger">* </span>All fields are mandatory.</p>
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
                        <FormFeedback invalid={this.state.invalidUsername.toString()}>Please enter valid username</FormFeedback>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input invalid={this.state.invalidPassword} type="password"
                          placeholder="Password" autoComplete="password"
                          value={this.state.password} onChange={(event) => {
                            this.setState({
                              password: event.target.value,
                              invalidPassword: false,
                              error: 'none'
                            })
                          }}
                        />
                        <FormFeedback invalid={this.state.invalidPassword.toString()}>Please enter password</FormFeedback>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input invalid={this.state.invalidEmployeeId} type="number"
                          placeholder="Employee id" autoComplete="EmployeeId"
                          value={this.state.EmployeeId} onChange={(event) => {
                            this.setState({
                              EmployeeId: event.target.value,
                              invalidEmployeeId: false,
                              error: 'none'
                            })
                          }}
                        />
                        <FormFeedback invalid={this.state.invalidEmployeeId.toString()}>Please enter valid Employee id.</FormFeedback>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input invalid={this.state.invalidFirstName} type="text"
                          placeholder="FirstName" autoComplete="FirstName"
                          value={this.state.FirstName} onChange={(event) => {
                            this.setState({
                              FirstName: event.target.value,
                              invalidFirstName: false,
                              error: 'none'
                            })
                          }}
                        />
                        <FormFeedback invalid="true">Please enter First name.</FormFeedback>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input invalid={this.state.invalidLastName} type="text"
                          placeholder="LastName" autoComplete="LastName"
                          value={this.state.LastName} onChange={(event) => {
                            this.setState({
                              LastName: event.target.value,
                              invalidLastName: false,
                              error: 'none'
                            })
                          }}
                        />
                        <FormFeedback invalid="true">Please enter Last name.</FormFeedback>
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>@</InputGroupText>
                        </InputGroupAddon>
                        <Input invalid={this.state.invalidEmail} type="text"
                          placeholder="Email" autoComplete="Email"
                          value={this.state.Email} onChange={(event) => {
                            this.setState({
                              Email: event.target.value,
                              invalidEmail: false,
                              error: 'none'
                            })
                          }}
                        />
                        <FormFeedback invalid="true">{this.state.emailValidMsg}</FormFeedback>
                      </InputGroup>
                      <InputGroup style={{ width: "40%" }} invalid={this.state.invalidRole} className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        {/* <Dropdown isOpen={this.state.dropDownSkills} toggle={this.toggle} invalid={this.state.invalidSkill}>
                        <DropdownToggle caret>
                        {this.state.dropDownValue}
                        </DropdownToggle>
                        <DropdownMenu>
                        {this.state.skills.map(e => {
                        return <DropdownItem id={e.id} key={e.skillName} onClick={this.changeValue}>{e.skillName}</DropdownItem>
                    })} 
                        </DropdownMenu>
                      </Dropdown> */}
                        <Input invalid={this.state.invalidSkill}
                          type="select"
                          id="skills"
                          value={this.state.skillId} onChange={(event) => {
                            this.setState({
                              skillId: event.target.value,
                              invalidSkill: false
                            })
                          }}
                        >
                          <option value="">  {this.state.dropDownValue}</option>
                          {
                            this.state.skills && this.state.skills.map((data) => {
                              return (
                                <option value={data.id}>{data.skillName}</option>
                              )
                            })
                          }


                        </Input>
                        <FormFeedback invalid={this.state.invalidSkill.toString()}>Please select skill</FormFeedback>
                      </InputGroup>


                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>Roles</InputGroupText>
                      </InputGroupAddon>

                      {this.state.roles.map((role, index) => {

                        return <InputGroup className="mb-3" id={index} style={index === 0 ? { marginTop: "-6%", marginLeft: "20%" } : { marginLeft: "20%" }}>
                          <Label for="Role" check>{this.showRoles(role.name)}</Label>
                          <Input invalid={this.state.invalidRole} type="checkbox" name={role.name} id={role.id} onChange={this.changeValueRole} />
                          {index === (this.state.roles.length - 1) && (<FormFeedback >Please select atleast one role</FormFeedback>)}
                        </InputGroup>
                      })}


                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>

          </ModalBody>
          <ModalFooter className="modelFooter">
            <Button variant="success" onClick={this.registerBtn}>
              Create
           </Button>
            <Button variant="danger" onClick={this.closeModal}>
              Cancel
           </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export const mapStateToProps = state => {
  return {
    upcoming: state.userReducer.upcomingData,
    userSession: state.session.user,
    users: state.adminReducer.users
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUserModel);