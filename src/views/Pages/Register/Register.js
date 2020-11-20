import React, { Component,Fragment } from 'react';
import {
  Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup,
  InputGroupAddon, InputGroupText, Row, FormFeedback, Dropdown, DropdownMenu, DropdownToggle, DropdownItem
}
  from 'reactstrap';
  import { AppFooter } from "@coreui/react";
  import { Link } from 'react-router-dom';
import axios from "axios";
import Popup from "./Popup";
import * as constants from '../../../constants'
const DefaultHeader = React.lazy(() => import("../Login/header"));
// const DefaultHeader = React.lazy(() => import("../../../containers/Layout/Header"));
const DefaultFooter = React.lazy(() =>
  import("../../../containers/Layout/Footer")
);

class Register extends Component {



  constructor(props) {
    super(props);
    this.state = {
      invalidUsername: false,
      invalidPassword: false,
      invalidEmployeeId: false,
      invalidFirstName: false,
      invalidLastName: false,
      invalidEmail: false,
      showPopUp: false,

      invalidPasswordConstraint: false,
      booleanPassCheck: false,
      invalidEmailConstraint: false,
      booleanEmailCheck: false,

      username: '',
      password: '',
      EmployeeId: '',
      FirstName: '',
      LastName: '',
      Email: '',
      skillId: '',
      popUpMessage:'',
      error:'none',
      status:'',

      skills: [{id:2,skillName:"java"}],
      dropDownValue: 'Select Skills',
      dropdownOpen: false,
      redirectLoginFlag: false
    }

    this.toggle = this.toggle.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.validatePassword = this.validatePassword.bind(this);    

  }

  toggle(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  changeValue(e) {
    this.setState({ dropDownValue: e.currentTarget.textContent,
                    skillId: e.currentTarget.getAttribute("id") });
    
    console.log(e.currentTarget.getAttribute("id"));
}

 
  componentDidMount() {
  console.log("did mount ",constants.BASE_URL + '/skills/all');
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

validatePassword(pass) {
  var reg  = /^(?=.*[A-Za-z])(?=.*\d).{6,15}$/;
  var test = reg.test(pass);
  this.setState({
   booleanPassCheck: test,
    });
}

validateEmail(email) {
  var reg =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var test = reg.test(String(email).toLowerCase());
  this.setState({
    booleanEmailCheck: test,
  })
}

closePopUp= ()=>{

  this.setState({
    showPopUp:false
  });
  this.props.history.push("/login");
}

  registerBtn = async (event) => {
    event.preventDefault();
    if (this.state.username === '' || this.state.booleanPassCheck===false || this.state.FirstName === '' || this.state.LastName === '' || this.state.booleanEmailCheck === false || this.state.EmployeeId === '') {
      this.setState({
        invalidUsername: this.state.username === '' ? true : false,
        invalidPasswordConstraint: this.state.booleanPassCheck === true ? false : true, 
        invalidPassword: this.state.password === '' ? true : false,
        invalidEmployeeId: this.state.EmployeeId === '' ? true : false,       
        invalidFirstName: this.state.FirstName === '' ? true : false,
        invalidLastName: this.state.LastName === '' ? true : false,
        invalidEmail: this.state.Email === '' ? true : false,
        invalidEmailConstraint: this.state.booleanEmailCheck === true ? false : true, 
        
      });
    } else {
      console.log("user ==>" + this.state.username);
      console.log("pass ==>" + this.state.password);

      const skill = {
        id: this.state.skillId
      };
      const user = {
        username: this.state.username,
        password: this.state.password,
        employeeId: this.state.EmployeeId,
        firstName: this.state.FirstName,
        lastName: this.state.LastName,
        email: this.state.Email,
        skills: skill
      };

      axios.post(constants.BASE_URL + '/api/auth/signup', user)
        .then(res => {    
          console.log(res);      
          if (res.status === 201 || res.status === 200) {
            this.setState({showPopUp:true,status:res.status,popUpMessage:res.data.message,redirectLoginFlag:true});
           
          } else {
            this.setState({
              redirectLoginFlag:false
            })
            console.log(res.data.message);
          }
        }).catch((error) => {
          this.setState({ error: '' });
          if (error.response) {
            this.setState({
              popUpMessage: error.response.data.message,
              status:error.response.status,
              showPopUp:true
            });
          }
          else
            console.log('Connection Refused by Server..!!')
        });
    }
  }

  render() {
    return (
      <Fragment>
               <DefaultHeader />
      <div className="app flex-row align-items-center">
      {this.state.showPopUp && (
          <Popup message={this.state.popUpMessage} status={this.state.status} closePopUp={this.closePopUp} redirectToLogin={this.state.redirectLoginFlag}/>
        )}
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.registerBtn}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
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
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                        <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input invalid={this.state.invalidPasswordConstraint} type="password"
                        placeholder="Password" autoComplete="password"
                        value={this.state.password} onChange={(event) => {
                          this.setState({
                            password: event.target.value,
                            invalidPasswordConstraint: false,
                            error: 'none'
                          })
                          this.validatePassword(event.target.value);
                        }}
                      />
                      <FormFeedback invalid="true">Invalid Password. Try Alphanumeric password with range between 6-15 characters</FormFeedback>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input invalid={this.state.invalidEmployeeId} type="text"
                        placeholder="Employee id" autoComplete="EmployeeId"
                        value={this.state.EmployeeId} onChange={(event) => {
                          this.setState({
                            EmployeeId: event.target.value,
                            invalidEmployeeId: false,
                            error: 'none'
                          })
                        }}
                      />
                      <FormFeedback invalid="true">Please enter valid EmployeeId</FormFeedback>
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
                      <FormFeedback invalid="true">Please enter valid First Name</FormFeedback>
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
                      <FormFeedback invalid="true">Please enter valid Last Name</FormFeedback>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input invalid={this.state.invalidEmailConstraint} type="text"
                        placeholder="Email" autoComplete="Email"
                        value={this.state.Email} onChange={(event) => {
                          this.setState({
                            Email: event.target.value,
                            invalidEmailConstraint: false,
                            error: 'none'
                          })
                          this.validateEmail(event.target.value);}
                        }
                       
                      />
                      <FormFeedback invalid="true">Please enter valid Email.</FormFeedback>
                    </InputGroup>
                    {/* <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                        {this.state.dropDownValue}
                        </DropdownToggle>
                        <DropdownMenu>
                        {this.state.skills.map(e => {
                        return <DropdownItem id={e.id} key={e.skillName} onClick={this.changeValue}>{e.skillName}</DropdownItem>
                    })} 
                        </DropdownMenu>
                      </Dropdown>
                    </InputGroup> */}

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                          <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="select"
                          name="skillCategory"
                          id="skillCategory"
                          onChange={event=>{
                          this.setState({
                            skillId : event.target.value
                          });
                          
                        }}
                          >
                          <option value="">Select Competency</option>
                          {this.state.skills.map((value, key) => {
                          return (
                          <option key={key} value={value.id}>
                          {value.skillName}
                          </option>
                          );
                          })}
                        </Input> 
                      </InputGroup>
                    <Button color="success" block>Create Account</Button>
                    <span style={{position: "absolute", marginLeft: "20%"}}>Already have an account?</span>
                  <Link to="login" color="link" style={{position: "absolute", marginLeft: "53%"}} className="px-0">Sign in</Link>
                  </Form>
                  
                </CardBody>
                {/* <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter> */}
              </Card>
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

export default Register;
