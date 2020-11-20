import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {Label,FormGroup,
 Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup,
  InputGroupAddon, InputGroupText, Row, FormFeedback, Dropdown, DropdownMenu, DropdownToggle, DropdownItem
}
  from 'reactstrap';
  import {Button} from 'react-bootstrap';
  import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import { bindActionCreators } from "redux";
import axios from "axios";
import * as constants from '../../../constants'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class UpdateUserModel extends Component {
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
      invalidRole:false,
      invalidSkill:false,
      userId:'',
      username: '',
      // password: '',
      EmployeeId: '',
      FirstName: '',
      LastName: '',
      Email: '',
      skillId: '',
      error: 'none',
      selectedRoles:[],
      skills: [],
      roles:[],
      isActive:'',
      skill:{},
      oldRoles:[],
      dropDownValue: 'Select Skill',
      dropDownValueRoles: 'Select Role',
      dropDownValueIsActive:'',
      dropDownSkills: false,
      dropDownRoles:false,
      dropDownIsActive:false,
    };
     this.toggle = this.toggle.bind(this);
     this.toggleRoles = this.toggleRoles.bind(this);
     this.toggleIsActive = this.toggleIsActive.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeValueRole = this.changeValueRole.bind(this);
    this.changeValueIsActive = this.changeValueIsActive.bind(this);
    this.notify = this.notify.bind(this);
   
  }
closeModal = () => {
       window.removeEventListener('beforeunload', (e)=>{
         console.log("remove"); e.preventDefault(); return '';});
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
  toggleRoles(event){
     this.setState({
      dropDownRoles: !this.state.dropDownRoles
    });
  }
  toggleIsActive(event){
     this.setState({
      dropDownIsActive: !this.state.dropDownIsActive
    });
  }

  changeValue(e) {
    this.setState({ dropDownValue: e.currentTarget.textContent,
                    skillId: e.currentTarget.getAttribute("id"),
               });
                    
                    
    console.log(this.state.skillId);
    console.log(e.currentTarget.getAttribute("id"));
}
 
changeValueRole(event) {
var selectedRoles = this.state.selectedRoles;
if(event.target.checked){
  var role = {
    id : event.target.id,
    name:event.target.name
  }

this.setState({
  selectedRoles:[...selectedRoles,role]
})
}
else if(event.target.checked === false){
 var newRoles=[];
   for(var i=0;i<selectedRoles.length;i++){
      if(selectedRoles[i].id == event.target.id){
         selectedRoles.splice(i,1);
      }
   }
   this.setState({selectedRoles:selectedRoles})
}
}

changeValueIsActive(e){
  if(e.currentTarget.textContent === "BLOCK"){
    this.setState({ isActive:false,dropDownValueIsActive:"BLOCK"})
    
  }
  else{
    console.log("Active")
    this.setState({isActive:true,dropDownValueIsActive:"ACTIVE"})
  }
}
showRoles(roleName){
  return roleName.substring(roleName.indexOf('_')+1)
}

  componentDidMount() {

  // if(window.confirm("Changes you made may not be saved.")){
  //   alert("page refresh");
  // }else{
    // if(this.props.poPup){
  //  window.addEventListener('beforeunload', function (event) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     // alert(window.confirm("Changes you made may not be saved first."));
  //   event.returnValue  = "Changes you made may not be saved.";
  //  }, true);
    // }
  // }
      let data = {
      tokenType: this.props.userSession.tokenType,
      accessToken : this.props.userSession.accessToken
    }
    this.setState({
      token:data
    })
    this.props.getUsersForAdmin(data);

    let row = this.props.row;
    let isActiveValue=""
    if(row.isActive === true){
      isActiveValue="ACTIVE"
    }
    else{
      isActiveValue="BLOCK"
    }
    this.setState({
      dropDownSkills: false,
      dropDownRoles:false,
      dropDownIsActive:false,
      userId:row.userId,
      username: row.username,
      EmployeeId: row.employeeId,
      FirstName: row.firstName,
      LastName: row.lastName,
      Email: row.email,
      // password:row.password,
      skill: row.skills,
      oldRoles:row.roles,
      isActive:row.isActive,
      selectedRoles:row.roles,
      //dropDownValue:row.skills.skillName,
      dropDownValueIsActive:isActiveValue
    })
    if(row.skills){
      this.setState({dropDownValue:row.skills.skillName})
    }
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


rolesIsActive(){
  if(this.state.isActive === true){return "ACTIVE"}
  else{return "BLOCK"}
}
 notify = (successMsg) =>  toast.success(successMsg, {hideProgressBar: true});
  registerBtn = async (event) => {
    event.preventDefault();
       const users = this.state.users;
    if (this.state.username === '' || this.state.FirstName === '' || this.state.LastName === '' || this.state.Email === '' || this.state.EmployeeId === '' ||!this.state.Email.includes('@') ||this.state.selectedRoles.length === 0) {
      this.setState({
        invalidUsername: this.state.username === '' ? true : false,
        invalidEmployeeId: this.state.EmployeeId === '' ? true : false,       
        invalidFirstName: this.state.FirstName === '' ? true : false,
        invalidLastName: this.state.LastName === '' ? true : false,
        invalidEmail: this.state.Email === '' ||!this.state.Email.includes('@') ? true : false,
        invalidRole:this.state.selectedRoles.length === 0?true:false,
        invalidSkill:this.state.skillId === ''?true:false
      });
    }

     else {
      let skill = {}
      if(this.state.skillId !== ''){
      skill = {
        id:this.state.skillId,
        skillName:this.state.dropDownValue
      }    
    }
    else{
      console.log(this.state.skill)
      skill = this.state.skill
    }
      
      var roles = this.state.selectedRoles
      if(roles.length === 0){
        roles = this.props.row.roles
      }
      const user = {
        userId:this.state.userId,
        // username: this.state.username,
        // password: this.state.password,
        employeeId: this.state.EmployeeId,
        firstName: this.state.FirstName,
        lastName: this.state.LastName,
        // email: this.state.Email,
        skills: skill,
        roles:roles,
        isActive:this.state.isActive
      };
      console.log(user)
      var successMsg="";
     await axios.put(constants.BASE_URL + '/admin/users/'+user.userId, user, {
              headers: {
           Authorization: this.props.tokenData.tokenType + " " + this.props.tokenData.accessToken,
           ContentType: "application/json"
          }
            })
        .then(res => {          
           if (res.status === 200) {
            successMsg="User Updated Successfully!";
            this.setState({
                  users
            })
            this.componentDidMount();
            this.notify(successMsg);
            this.closeModal();
          } else {
            console.log(res.data.message);
          }
        }).catch((error) => {
          this.setState({ error: '' });
          if (error.response) {
            successMsg=error.response.data.message
            this.notify(successMsg);
            console.log(error.response.data.message)
          }
          else
            console.log('Connection Refused by Server..!!')
        });

    }

  }
  render() {
    let { open } = this.state;
    const message = this.props.message;
    if(this.state.open === false){
       return <Redirect to='/admin/users' />
    }
    const isActive = [{id:1,name:"ACTIVE"},{id:2,name:"BLOCK"}];
    return (
      <div className="app flex-row align-items-center" id="myBtn">
        <Modal isOpen={open}>
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
                  <Form >
                    <h1>Update User</h1>
                    <p className="text-muted label-updateUser">Username</p>
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
                      disabled />
                      <FormFeedback invalid={this.state.invalidUsername.toString()}>Please enter valid username.</FormFeedback>
                    </InputGroup>
                    <p className="text-muted label-updateUser">Employee Id</p>
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
                      <FormFeedback invalid={this.state.invalidEmployeeId.toString()}>Please enter valid employee id</FormFeedback>
                    </InputGroup>
                     <p className="text-muted label-updateUser">First Name</p>
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
                       <FormFeedback invalid={this.state.invalidFirstName.toString()}>Please enter first name.</FormFeedback>
                    </InputGroup>
                     <p className="text-muted label-updateUser">Last Name</p>
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
                       <FormFeedback invalid={this.state.invalidLastName.toString()}>Please enter last name.</FormFeedback>
                    </InputGroup>
                     <p className="text-muted label-updateUser">Email</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
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
                      disabled/>
                       <FormFeedback invalid={this.state.invalidEmail.toString()}>Please enter valid email.</FormFeedback>
                    </InputGroup>
                    {/*<InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Dropdown isOpen={this.state.dropDownSkills} toggle={this.toggle}>
                        <DropdownToggle caret>
                        {this.state.dropDownValue}
                        </DropdownToggle>
                        <DropdownMenu>
                        {this.state.skills.map(e => {
                        return <DropdownItem id={e.id} key={e.skillName} onClick={this.changeValue}>{e.skillName}</DropdownItem>
                    })} 
                        </DropdownMenu>
                      </Dropdown>
                        <FormFeedback invalid={this.state.invalidSkill.toString()}>Please enter one skill.</FormFeedback>                       
                    </InputGroup>*/}



                    <p className="text-muted label-updateUser">Skill</p>
                      <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                          <Input
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
                        </InputGroup>




                    {/*<InputGroup invalid={this.state.invalidRole} className="mb-3">
                    {this.state.roles.map(role => {
                      const oldRoles = this.state.oldRoles
                        let checkedValue = false;
                        oldRoles.map((oRole) => {
                            if(oRole.id === role.id){
                              checkedValue =  true;
                            }
                        })
                   return <Col md={3}>
                      <FormGroup check>
                      <Input type="checkbox" defaultChecked={checkedValue} name={role.name} id={role.id} onChange={this.changeValueRole}/>
                      <Label for="Role" check>{this.showRoles(role.name)}</Label>
                    </FormGroup>
                    </Col>
                    })}
                    </InputGroup>
                     <FormFeedback invalid={this.state.invalidRole.toString()}>Please enter atleast one role.</FormFeedback>
                   */}
                  <InputGroup className="mb-3" style={{marginTop: "5%"}}>
                         <InputGroupAddon addonType="prepend">
                        <InputGroupText>Roles</InputGroupText>
                      </InputGroupAddon>


                      {this.state.roles.map((role, index) => {
                      const oldRoles = this.state.oldRoles
                        let checkedValue = false;
                        
                        oldRoles.map((oRole) => {
                            if(oRole.id === role.id){
                              checkedValue =  true;
                            }
                        })
                        return <InputGroup className="mb-3" id={index} style={index === 0 ? { marginTop: "-6%", marginLeft: "20%" } : { marginLeft: "20%" }}>
                          <Label for="Role" check>{this.showRoles(role.name)}</Label>
                          <Input invalid={this.state.invalidRole} type="checkbox"  defaultChecked={checkedValue} name={role.name} id={role.id} onChange={this.changeValueRole} />
                           {index === (this.state.roles.length - 1) && (<FormFeedback invalid={this.state.invalidRole}>Please select atleast one role</FormFeedback>)}
                        </InputGroup>
                      })}

                      </InputGroup>
                   
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                        <Dropdown isOpen={this.state.dropDownIsActive} toggle={this.toggleIsActive}>
                        <DropdownToggle caret>
                        {this.rolesIsActive()}
                        </DropdownToggle>
                        <DropdownMenu>
                        {isActive.map(e => {
                        return <DropdownItem id={e.id} key={e.name} onClick={this.changeValueIsActive}>{e.name}</DropdownItem>
                    })} 
                        </DropdownMenu>
                      </Dropdown>
                    </InputGroup>

                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </ModalBody>
        <ModalFooter className="modelFooter">
           <Button type="submit" variant="info" onClick={this.registerBtn}>
             Update
           </Button>
           <Button variant="danger" onClick={this.closeModal}>
             Cancel
           </Button>
         </ModalFooter>
        </Modal>
        
      </div>
    );
  }
  componentDidUnmount() {  
    this.setState({
      open: true
    })
    // window.removeEventListener('beforeunload', (e)=>{
      
      
      
    //   console.log("remove"); e.preventDefault(); return '';});
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
)(UpdateUserModel);
