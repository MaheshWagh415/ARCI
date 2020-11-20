import React, { Component } from 'react'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import {Button, ButtonToolbar } from 'react-bootstrap';
import AddSkillModal from "./AddSkillModal";
import UpdateSkillModal from './UpdateSkillModal';
import DeleteSkillModal from './DeleteSkillModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  SearchField,
  TableBodyColumn
} from "react-bootstrap-table";
import "react-widgets/dist/css/react-widgets.css";
import axios from 'axios';
class Skills extends Component {
constructor(props) {
    super(props);
    this.state = {
      skills : null,
      accessToken : '',
      tokenType : '',
      skillId : 0,
      skillData : {},
      updateSkill : {},
      addModalShow : false,
      deleteModalShow : false,
      updateModalShow : false,
      message : '', 
      tempData: ''
    };
    this.notify = this.notify.bind(this);
  }


  buttonFormatter(cell, row, rowIndex, e) {
    return (
      <div>
       {/*<Button type="button" className="btn btn-primary" size="sm" onClick={() => this.setState({
         updateSkill : row, updateModalShow : true})}>Update</Button>*/}
         <i className="fa fa-pencil fa-xs updateIcon" onClick={() => this.setState({
         updateSkill : row, updateModalShow : true
         })}></i>
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       {/*<Button type="button" className="btn btn-danger" size="sm" onClick={() => this.setState({
         skillData : row,
         deleteModalShow : true
         })}>Delete</Button>*/}
         <i className="fa fa-trash-o fa-xs deleteIcon" onClick={() => this.setState({
         skillData : row,
         deleteModalShow : true
         })}></i>
       </div>
    )
}


 shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.skills && nextProps.skills.status) {
      return true;
    } else if (nextState != this.state) {
      return true;
    } else {
      return false;
    }
  }
  
  componentDidMount() {
        let { accessToken, tokenType } = this.props.userSession;
        this.setState({
      accessToken: accessToken,
      tokenType: tokenType
        });
        let data = { accessToken, tokenType };
        this.props.skillAction(data);
        this.componentDidUpdate();
  }

componentDidUpdate(prevProps, prevState) {
    if (this.props.skills && this.props.skills.status) {
      let { data, status } = this.props.skills;
      
      if (prevProps != this.props && status === 200) {
        let tempData = [];
        data.map((data, index) => {
          tempData.push({ ...data, "Sr No": ++index, "Competency": data.skillName });
        });
        this.setState(
          {
            skills: tempData
          });
      }
    }
  }

  notify = (msg) => toast.success(msg, {position: "bottom-right",autoClose: 2000,hideProgressBar: false,
  closeOnClick: true, pauseOnHover: true, draggable: true});

    closeSucess = () => {
      if(this.state.addModalShow === true){
          this.setState({
            addModalShow : false,
            message : ''
      });
      }
      else if(this.state.updateModalShow === true) {
           this.setState({
            updateModalShow : false,
            message : ''
      });
    }
    else {
      this.setState({
            deleteModalShow : false,
            message : ''
      });
    }
  };
  
  onSearchChange = (searchText)=>{
    var searchVal = searchText.toLowerCase();
    var tempData = [];
    let {data} = this.props.skills;
    let csvData = [
      [
        "Sr no",
        "Competency"
      ]
    ];
    data.map((data, index) => {
      let skillsName = data.skillName.toLowerCase();
      if(searchVal === skillsName){
        tempData.push({ ...data, index: ++index }); 
        var dataNewObj = [
          index,
          data.skillName
        ];
        csvData.push(dataNewObj)
        this.setState({
          skills: csvData
        });
      }
      // else  if(skillsName.includes(searchVal)){
      //   tempData.push({ ...data, "Sr No": ++index, "Competency": data.skillName });
      //   this.setState({
      //     skills: tempData
      //   });
      // }
     
    });
    if(tempData.length<=0){

      this.setState({ csvData: 'There is no data to display' });
    }
  }
    render() {
        const skills = this.state.skills;
        let addModalShow = () => this.setState({addModalShow : false});
        const options = {
      // page: 5,  // which page you want to show as default
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
          value: skills && skills.length
        }
      ], // you can change the dropdown list for size per page
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "Prev", // Previous page button text
      nextPage: "Next", // Next page button text
      firstPage: "First", // First page button text
      lastPage: "Last", // Last page button text
      paginationPosition: "bottom", 
      onSearchChange: this.onSearchChange,
      //exportCSVBtn: this.createCustomExportCSVButton,
      // default is bottom, top and both is all available
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
      // paginationPanel: this.renderPaginationPanel
      exportCSVBtn: this.createCustomExportCSVButton,
      // searchField: this.createCustomSearchField
    };
        return (
             <div className="animated fadeIn" style={{ backgroundColor: "#FFF" }}>
            <ToastContainer position="bottom-right"
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
        <Card>
          <CardBody className="upcoming-table">
            <Form className="customForm">
              <Row>
                <Col md={{ span: 4, offset: 4 }}>
                </Col>
                <Col md={3}>
                  </Col>
                <Col md={2}>
                  <Button className="submitButton" onClick={this.formSubmit}>
                  </Button>
                </Col>
              </Row>

              {skills && (
                <BootstrapTable
                  data={skills}
                  className="bootStrapTable"
                  isKey={true}
                  ref="table"
                  pagination
                  keyField="id"
                  options={options}
                  search={true}
                  exportCSV
                  search
                  loading={true}
                >
                  <TableHeaderColumn                    
                    dataField="Sr No"
                    dataSort={true}
                    width={"8%"}
                  >
                    #
                  </TableHeaderColumn>
                  <TableHeaderColumn  dataField="Competency" dataSort={true}>
                    Competency
                  </TableHeaderColumn>

                   
                  <th >
                  <button className="clients_actions"  dataField="button" dataFormat={this.buttonFormatter.bind(this)}
                  editable={false}
                  >
                  Actions
                  </button> 
                  </th> 
                </BootstrapTable>
              )}

              <Button variant='success' onClick={() => this.setState({addModalShow : true
              })}>Add Competency</Button>          
              {this.state.addModalShow && (
              <AddSkillModal 
              close={this.closeSucess} 
              notifyAlert={this.notify}/>
        )}
              {this.state.updateModalShow && (
              <UpdateSkillModal 
              close={this.closeSucess} 
              updateSkill={this.state.updateSkill}
              notifyAlert={this.notify} />
        )}

        {this.state.deleteModalShow && (
              <DeleteSkillModal 
              close={this.closeSucess} 
              skillData={this.state.skillData}
              notifyAlert={this.notify}
              />
        )}
            </Form>
          </CardBody>
        </Card>
      </div>
        )
    }
}

export const mapStateToProps = state => {
  return {
    userSession: state.session.user,
    skills: state.adminReducer.skills
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(Skills);
