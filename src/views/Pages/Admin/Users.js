import React, { Component } from 'react'
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import { bindActionCreators } from "redux";
import {Button} from "react-bootstrap";
import AddUserModel from "./AddUserModel"
import UpdateUserModel from "./UpdateUserModel"
import { CSVLink } from "react-csv";
import {
  Card,
  CardBody,
  Row,
  Badge,
  Col,
  Form,
  Label,
  CardHeader
} from "reactstrap";
import {
  BootstrapTable,
  TableHeaderColumn,
  ExportCSVButton,
  SearchField
} from "react-bootstrap-table";
import * as constants from "../../../constants";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users : [],
      csvData: null,
      firstName:"",
      lastName:"",
      email:"",
      username:"",
      isActive:false,
      roles:[],
      skills:{},
      message:"",
      addUser:false,
      updateUser:false,
      deleteUser:false,
      row:"",
      updatable:false,
      token:{}
    };
  }
  createCustomExportCSVButton = onClick => {
    let { csvData } = this.state;
    console.log("createCustomExportCSVButton", csvData);
    
    try {
      return (
        <CSVLink
          data={csvData}
          class="btn btn-success react-bs-table-csv-btn hidden-print"
        >
          <span>
            <i class="fa glyphicon glyphicon-export fa-download"></i> Export to
            CSV
          </span>
        </CSVLink>
      );
    } catch (error) {
      console.log(error);      
    }
   
  };

  componentDidMount(){
     let data = {
      tokenType: this.props.userSession.tokenType,
      accessToken : this.props.userSession.accessToken
    }
   
    this.setState({
      token:data
    })
    this.props.getUsersForAdmin(data);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps != this.props || nextState != this.state) {
      return true;
    } else {
      return false;
    }
  }
  componentWillReceiveProps(nextProps){
    console.log("componentWillReceiveProps ->", nextProps);
    if(nextProps.users){
      console.log("users ->", nextProps.users);
      
          let tempData = [];
          let csvData = [
            [
              "Sr No",
              "First Name",
              "Last Name",
              "Email",
              "Username",
              "isActive",
              "Competency",
              "Roles"
              // "email",
             // "rmgRRFID"
            ]
          ];
        nextProps.users.map((data, index) => {                    
          tempData.push({ ...data, index: ++index });
          
          let arr = [
            index,
            data.firstName,
            data.lastName,
            data.email,
            data.username,
            //data.isActive,
            this.showAccessibility(null,data),
            data.skills && data.skills.skillName,
            this.showRoles(null,data)
          ];
          csvData.push(arr);
        });
        this.setState(
          {
            users: tempData,
            csvData
          },
          () => {
            console.log("csvData", this.state.csvData);
            
            this.props.spinnerAction(false);
          }
        );
    }
  }
  buttonFormatter(cell,row,rowIndex,e){
    return(
      <div>
        <Button variant="link"  onClick={() => this.setState({updateUser : true,row:row})}>Update</Button>
        {/*<Button variant="danger" size="sm" onClick={(e) => this.confirmationDeletePopup(e, row)}>Delete</Button>      */}
      </div>
    )
  }

  //   axios.delete(constants.BASE_URL + '/admin/users/'+row.userId)
  //       .then(res => {
  //         console.log(res)
  //          this.setState({
  //                redirect:true
  //            })
  //           if(res.status === 200){
  //           this.setState({
  //             message:"Updated Successfully."
  //           })
  //       }
  //     })
  //     .catch(error => {
  //       console.log(typeof(error))
  //         console.log(error.message)

  //      this.setState({
  //        redirect:true,
  //        message:error.response.data.message
  //      })
  //     })
  // }
    showSkills(cell, row) {
      if(row.skills){
        return row.skills.skillName;
      }
      else 
      return "N/A";
  }
  showRoles(cell, row) {
    var rolesName = "";
    for(var i=0;i<row.roles.length;i++){
      if(i===0){
        rolesName=row.roles[i].name.substring(row.roles[i].name.indexOf('_')+1);
      }
      else
      rolesName = rolesName +", "+ row.roles[i].name.substring(row.roles[i].name.indexOf('_')+1) ;
    }
      return rolesName
  }
  showAccessibility(cell,row){
    if(row.isActive === true){
      return "ACTIVE"
    }
    else{
      return "BLOCK"
    }
  }
 
  closeSucess = () => {
    this.setState({
      sucessMsg: !this.state.sucessMsg,
      updateUser : false,
      addUser:false
    });
    
  };
  onSearchChange = (searchText) => {
    var searchVal = searchText.toLowerCase();
    var tempData = [];
    let data = this.state.users;
    let csvData = [
      [
        "Sr No",
        "First Name",
        "Last Name",
        "Email",
        "Username",
        "isActive",
        "Competency",
        "Roles"
        // "email",
       // "rmgRRFID"
      ]
    ];
    data.map((associateN, index) => {
      let firstName = associateN.firstName.toLowerCase();
      if( searchVal === firstName){
        tempData.push({ ...associateN, index: ++index });
        var dataNewObj = [
          index,
          associateN.firstName,
          associateN.lastName,
          associateN.email,
          associateN.username,
          this.showAccessibility(null,associateN),
         associateN.skills && associateN.skills.skillName,
         this.showRoles(null,associateN)
          
        ];
        csvData.push(dataNewObj);
        this.setState({
          csvData: csvData,
        });
      }
      else if( firstName.includes(searchVal)){
        tempData.push({ ...associateN, index: ++index });
        var dataNewObj = [
          index,
          associateN.firstName,
          associateN.lastName,
          associateN.email,
          associateN.username,
          this.showAccessibility(null,associateN),
         associateN.skills && associateN.skills.skillName,
         this.showRoles(null,associateN)
          
        ];
        csvData.push(dataNewObj);
        this.setState({
          csvData: csvData,
        });
      }
      if(tempData.length<=0){
        this.setState({ csvData: "There is no data to display" });
      }
    })
  }

 render() {
   let options = null;
   const cellEditProp = {
    mode: 'click',
    afterSaveCell: this.onAfterSaveCell
  };

  const roles = [
    "ROLE_ADMIN",
    "ROLE_USER",
    "ROLE_ASSOCIATE"
  ]
  const isActive=[
    "BLOCK","ACTIVE"
  ]
    const users = this.state.users;
  if(this.state.csvData) {
    options = {
      sizePerPageList: [
        {
          text: "5",
          value: 5
        },
        {
          text: "10",
          value: 10
        },
        {
          text: "All",
          value: users && users.length
        }
      ], 
      sizePerPage: 5, 
      pageStartIndex: 1,
      paginationSize: 3, 
      prePage: "Prev", 
      nextPage: "Next", 
      firstPage: "First", 
      lastPage: "Last", 
      paginationPosition: "bottom", 
      exportCSVBtn: this.createCustomExportCSVButton,
      onSearchChange: this.onSearchChange
    };
  } else {
    options = {
      sizePerPageList: [
        {
          text: "5",
          value: 5
        },
        {
          text: "10",
          value: 10
        },
        {
          text: "All",
          value: users && users.length
        }
      ], 
      sizePerPage: 5, 
      pageStartIndex: 1,
      paginationSize: 3, 
      prePage: "Prev", 
      nextPage: "Next", 
      firstPage: "First", 
      lastPage: "Last", 
      paginationPosition: "bottom"      
    };
  }
     
    return (
       <div className="animated fadeIn">
         <Card>
          <CardBody className="upcoming-table">
            <Form className="customForm">
              <Row>
                <Col md={{ span: 3, offset: 2 }}>
                 
                </Col>
                <Col md={3}>
                  
                </Col>
                <Col md={2}>
                  <Button className="submitButton" >

                  </Button>
                </Col>
              </Row>

              {users && (
                <BootstrapTable
                  data={users}
                  className="bootStrapTable"
                  isKey={true}
                  ref="table"
                  pagination
                  keyField="userId"
                  options={options}
                  search={true}
                  exportCSV
                  search
                  searchPlaceholder='Search by first name'
                  
                >
                  <TableHeaderColumn                    
                    dataField="index"
                    dataSort={true}
                    width={"8%"}
                  >
                    #
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="firstName" dataSort={true}>
                    First Name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="lastName" dataSort={true}>
                    Last Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="email"
                  >
                    Email
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="username"
                    dataSort={true}
                  >
                    User Name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="isActive" dataSort={true}
                  dataFormat={this.showAccessibility.bind(this)}
                  
                  >
                    Active
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="skills.skillName"
                  dataFormat={this.showSkills.bind(this)}
                  >
                    Competency
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="roles.name" 
                  dataFormat={this.showRoles.bind(this)}
                  
                  >
                    Roles
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="button" editable={ false }
                    dataFormat={this.buttonFormatter.bind(this)}
                  >
                    Actions
                  </TableHeaderColumn>
                </BootstrapTable>
              )}
              <Button variant='success' onClick={() => this.setState({addUser : true
             })}>Add User</Button>
              {this.state.addUser && (
         <AddUserModel close={this.closeSucess} tokenData={this.state.token} notify={this.notify} />
       )}
       {this.state.updateUser && (
         <UpdateUserModel close={this.closeSucess} tokenData={this.state.token} row={this.state.row} notify={this.notify}/>
       )}
            </Form>
            
          </CardBody>
        </Card>
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
)(Users);
