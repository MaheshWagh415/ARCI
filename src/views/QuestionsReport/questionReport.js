import React, { Fragment, Component } from "react";
import "react-multi-email/style.css";
import {
  Card,
  CardBody,
  Row,
  Badge,
  Col,
  Form,
  Label,
  Button,
  FormGroup,
  Input,
  FormFeedback
} from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import {
  BootstrapTable,
  TableHeaderColumn,
  ExportCSVButton,
  SearchField
} from "react-bootstrap-table";
import Select from "react-select";
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import CONSTANTS from "../../lib";
import "react-widgets/dist/css/react-widgets.css";
import { CSVLink, CSVDownload } from "react-csv";
import axios from "axios";
import * as baseConstants from "../../constants";

Moment.locale("en");
momentLocalizer();
class QuestionsReport extends Component {
  constructor(props) {
    super(props);
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let toDate = new Date(year, month + 3, day);
    this.state = {
      data: [],
      fromDate: new Date(),
      toDate,
      updateUser: false,
      row: "",
      token: {},
      clients: [],
      clientGroup: [],
      accessToken: "",
      tokenType: "",
      selectedValue: [],
      clientName: [],
      Obj: [],
      skillName: [0, 0],
      clientId: "",
      groupName: "",
      clientGroupList: [],
      skillGroup: [],
      skill: [],
      skillid: "",
      selectedOption: null,
      selectedClientGroup: null,
      selectedClient: null,
      disabled: "",
      display: "",
      clientIds:"",
      clientGroupIds:"",
      fields: {
        cName: "",
        groupName: "",
        skillCategory: "",
        skillName: ""
      },
      errors: {
        cName: "",
        skillCategory: "",
      },
      invalid:{
        cName: false,
        skillCategory: false
      }
    };
  }
  componentDidMount() {
    let { accessToken, tokenType } = this.props.userSession;
    this.setState(
      {
        accessToken: accessToken,
        tokenType: tokenType
      },
      () => {
        this.getaDataSkillApi("/skills/all", "skill");
        this.getaDataApi("/client/all", "client");
      }
    );
    //this.setState({ data: this.props.allQuestionReports });
    //this.props.getAllQuestionReports(data);
    //this.props.getAssociateDataAction(data);
  }
  getaDataSkillApi = (concatUrl, setdata) => {
    let tempName = setdata;
    let url = baseConstants.BASE_URL + concatUrl;
    axios
      .get(url, {
        headers: {
          Authorization: this.state.tokenType + " " + this.state.accessToken,
          ContentType: "application/json"
        }
      })
      .then(res => {
        if ("skill" == tempName) {
          const newskillName = [];

          res.data.map(d => {
            newskillName.push({ label: d.skillName, value: d.id });
          });
          this.setState({ skillName: newskillName });
          //clientName = this.sortArrayObj(clientName);
        } else {
          this.setState({
            [tempName]: res.data
          });
        }
      })
      .catch(error => {
        console.log("error ==>", error);
      });
  };

  getaDataApi = (concatUrl, setdata) => {
    let tempName = setdata;
    let url = baseConstants.BASE_URL + concatUrl;

    axios
      .get(url, {
        headers: {
          Authorization: this.state.tokenType + " " + this.state.accessToken,
          ContentType: "application/json"
        }
      })
      .then(res => {
        if ("client" == tempName) {
          let clientGroupList = [],
            clientName = [];
          res.data.map(d => {
            clientName.push({ label: d.clientName, value: d.id});
            d.clientGroups.map(clientg => {
              clientGroupList.push({
                id: clientg.id,
                name: clientg.groupName,
                clientId: d.id
              });
            });
          });

          //clientName = this.sortArrayObj(clientName);

          this.setState({
            clientGroupList: clientGroupList,
            clientName: clientName
          });
        } else {
          this.setState({
            [tempName]: res.data
          });
        }
      })
      .catch(error => {
        console.log("error ==>", error);
      });
  };
  getSkills = selectedOption => {
    this.setState({ skillCategory: { ...this.state.errors.skillCategory= "", ...this.state.invalid.skillCategory= "false" } });
    this.setState({ selectedOption });
  };

  sortArrayObj = (data, label) => {
    let k = data.sort(function(a, b) {
      // var nameA = a.label.toUpperCase();
      // var nameB = b.label.toUpperCase();
      var nameA = a.label;
      var nameB = b.label;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return k;
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allQuestionReports && this.props.allQuestionReports.status) {
      let { data, status } = this.props.allQuestionReports;
      if (prevProps != this.props && status === 200) {
        let tempData = [];
        let csvData = [
          [
            "Sr no",
            "Client Name",
            "Client Group Name",
            "Competency",
            "Questions"
          ]
        ];
        data.map((data, index) => {
          tempData.push({ ...data, index: ++index });
          let arr = [
            index,
            data.client.clientName,
            data.clientGroup.groupName,
            //data.associateName,
            data.skills,
            //Moment(data.interviewDate).format("DD/MM/YYYY"),
            data.questionSet.text
            // data.questionSet.length > 0
            //   ? data.interviewStatus[0].status
            //   : "",
            //data.clientFeedback,
            //data.rmgRRFID
          ];
          csvData.push(arr);


        });
        this.setState(
          {
            data: tempData,
            csvData: csvData
          },
          () => {
            this.props.spinnerAction(false);
          }
        );
      }
    }
  }
  handleChangeClientGroup = selectedClientGroup => {
    if(this.state.selectedClient.length === 2 || selectedClientGroup === undefined){
     this.setState({ selectedClientGroup: "null"  });
    }
    else{
      this.setState({selectedClientGroup});   
    }
    
  };

  handleChange = selectedClient => {
    let tVal = [];
    this.setState({ selectedClient });
    this.setState({ cName: { ...this.state.errors.cName= "", ...this.state.invalid.cName ="false" } });
    //let targetValue = selectedClient;
    if (selectedClient != null) {
      selectedClient.map(val => {
        tVal.push({
          id: val.value
        });
      });
      if (selectedClient.length === 2) {
        this.setState({ disabled: "disabled" });
        this.handleChangeClientGroup();
      } else {
        this.setState({ disabled: "" });
      }
      
      this.changeClientName(tVal);
    }
    else{
      this.changeClientName(tVal);
    }
  };
  changeClientName = k => {
    let tempData = [];
    this.state.clientGroupList.map(data => {  
      k.map(cId => {
        if (cId.id === data.clientId) {
          tempData.push({ value: data.id, label: data.name });
        }
      });
      
    });
    let data = this.sortArrayObj(tempData);
    this.setState({
      clientGroup: data
    });
  };

  createCustomSearchField = props => {
    return <SearchField className="my-custom-class" placeholder="Search" />;
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const cAarry = this.state.selectedClient;
    const sArray = this.state.selectedOption;
    const cGArray = this.state.selectedClientGroup;
    let errors = {},invalid = {};
    if(cAarry === null && sArray === null){
      invalid["cName"] = true;
      errors["cName"] = CONSTANTS.ERROR.CLIENT_NAME;
      invalid["skillCategory"] = true;
      errors["skillCategory"] = CONSTANTS.ERROR.SKILL_CATEGORY;

      let errorstemp = {
        ...this.state.errors,
        ...errors
      };
      
      let invalidtemp = {
        ...this.state.invalid,
        ...invalid
      };
      this.setState({ errors: { ...errorstemp }, invalid: { ...invalidtemp } });
    }else{
      let client=[];
      let skills =[];
      let clientGroup=[];
      cAarry.map(m=>{
        client.push({"id": m.value});
      })
      sArray.map(m=>{
        skills.push({"id": m.value});
      })
      if(cGArray === "null" || cGArray === null ){
        clientGroup = null;
      }
      else{
        cGArray.map(m=>{
          clientGroup.push({"id": m.value});
        })
      }
    let { accessToken, tokenType } = this.props.userSession;
    let { fromDate, toDate } = this.state;
    
    fromDate = Moment(fromDate).format("DD-MM-YYYY");
    toDate = Moment(toDate).format("DD-MM-YYYY");
    fromDate = fromDate.replace(/-/g, "/");
    toDate = toDate.replace(/-/g, "/");
    
    let dataObj = {
      fromDate: fromDate,
      toDate: toDate,
      client,
      clientGroup,
      skills
      
    };
    axios
    .post(
      baseConstants.BASE_URL + "/questionreport/report",
      dataObj,
      {
        headers: {
          Authorization:
            tokenType + " " + accessToken
        }
      }
    )
    .then(res => {
      if(res.status === 200){
        const responseData = res.data;
        this.setState({ data: responseData  });
        
        
      }
    })
    .catch(error => {
        console.log("api fail", error);
    });
  }
   
  };
  DateTimeChange = (e, parm) => {
    this.setState({
      [parm]: e
    });
  };

  getClientName(cell, row) {
    let cname =[];
    try {
      if (cell) {
        cell.map(cellData=>{
          cname = cellData.clientName
        })
          return cname;
      }
    } catch (error) {
      return "N/A";
    }
  }
  getClientGroup(cell, row) {
    let cgroup =[];
    try {
      if (cell) {
        cell.map(cellGroup=>{
          cgroup = cellGroup.groupName
        })
        return cgroup;
      }
    } catch (error) {
      return "N/A";
    }
  } 
  getSkill(cell, row){ 
    let skill =[];
    try {
      if (cell) {
        cell.map(cellSkills=>{
          skill.push(cellSkills.technology.skillName);
        })
        
        return skill;
      }
    } catch (error) {
      return "N/A";
    }
  }
  getQuestion(cell, row) {
    let ques =[];
    try {
      if (cell) {
        cell.map(question=>{
          ques =question.text
        })
        return ques;
      }
    } catch (error) {
      return "N/A";
    }
  } 

  render() {
    let {
      data,
      skillName,
      selectedClient,
      clientName,
      selectedOption,
      disabled,
      selectedClientGroup,
      clientGroup,
      errors,
      fields,
      invalid
    } = this.state;
    
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
          value: data && data.length
        }
      ], // you can change the dropdown list for size per page
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "Prev", // Previous page button text
      nextPage: "Next", // Next page button text
      firstPage: "First", // First page button text
      lastPage: "Last", // Last page button text
      paginationPosition: "bottom", // default is bottom, top and both is all available
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
      // paginationPanel: this.renderPaginationPanel
      exportCSVBtn: this.createCustomExportCSVButton
      // searchField: this.createCustomSearchField
    };
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody className="question-table">
            <Form className="customForm" onSubmit={this.handleFormSubmit}>
              <Row>
                <Col md={{ size: 4 }}>
                  <FormGroup>
                    <Label htmlFor="name">
                      Client Name <span color="danger"> * </span>
                    </Label>
                    <Select
                      isMulti
                      type="select"
                      name="cName"
                      id="cName"
                      className={this.state.invalid.cName === true  ? "toSelectError" : "toSelectErrorQuestion"}
                      value={selectedClient}
                      onChange={this.handleChange}
                      invalid={this.state.invalid.cName}
                      options={clientName}
                      placeholder="Please select"
                      
                    />

                    <FormFeedback invalid="true" style={{display:"block"}} >
                      {this.state.errors.cName}
                    </FormFeedback>
                  </FormGroup>
                </Col>

                <Col md={{ size: 4 }}>
                  <FormGroup>
                    <Label htmlFor="ccnumber">Client Group Name</Label>
                    <Select
                    isMulti
                    name="groupName" 
                    id="groupName"
                    value={selectedClientGroup}
                    isDisabled= {this.state.disabled}
                    options={clientGroup}
                    onChange={this.handleChangeClientGroup}
                    placeholder="Please select"
                    /> 
                    <FormFeedback invalid="true">
                      {/* {this.state.errors.groupName} */}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={{ size: 4 }}>
                  <FormGroup>
                    <Label htmlFor="ccnumber">
                      Competency <span color="danger"> * </span>
                    </Label>
                   
                    <Select
                      isMulti
                      name="skillCategory"
                      id="skillCategory"
                      className={this.state.invalid.skillCategory === true  ? "toSelectError" : "toSelectErrorQuestion"}
                      value={selectedOption}
                      onChange={this.getSkills}
                      options={skillName}
                      invalid={this.state.invalid.skillCategory}
                      placeholder="Please select"
                      
                    />
                    <FormFeedback invalid="true" style={{display:"block"}}>
                      {this.state.errors.skillCategory}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
             
              <Row>
                <Col md={{ span: 3, offset: 2 }}>
                  <Label className="customFormLabel">From Date</Label>
                  <DateTimePicker
                    //className="dateTimePicker"
                    value={this.state.fromDate}
                    defaultValue={new Date()}
                    onChange={e => {
                      this.DateTimeChange(e, "fromDate");
                    }}
                    time={false}
                  />
                </Col>
                <Col md={{span: 3, offset: 1}}>
                  <Label className="customToLabel">To Date</Label>
                  <DateTimePicker
                    //className="dateTimePicker"
                    value={this.state.toDate}
                    defaultValue={new Date()}
                    onChange={e => {
                      this.DateTimeChange(e, "toDate");
                    }}
                    time={false}
                  />
                </Col>
                <Col md={{span: 3, offset: 1}}>
                  <Button
                    //className="submit"
                    color="info"
                    style={{ marginTop: "2%", position: "absolute" }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
            {data && (
                  <BootstrapTable
                    data={data}
                    className="bootStrapTableQuestion"
                    isKey={true}
                    ref="table"
                    pagination
                    keyField="id"
                    options={options}
                    search={true}
                    exportCSV
                    search
                  >
                    <TableHeaderColumn
                      dataField="index"
                      dataSort={true}
                      width={"8%"}
                    >
                      #
                    </TableHeaderColumn>
                    <TableHeaderColumn 
                    dataField="client" dataFormat={this.getClientName} dataSort={true}
                    >
                      Client
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="clientGroup"
                      dataFormat={this.getClientGroup}
                      dataSort={true}
                    >
                      Client Group
                    </TableHeaderColumn>
                    <TableHeaderColumn
                     // dataFormat={this.interviewDateFormat.bind(this)}
                      dataField="questionSet"
                      dataFormat={this.getSkill}
                      dataSort={true}
                    >
                      Skills
                    </TableHeaderColumn>
                    <TableHeaderColumn
                     // dataFormat={this.interviewDateFormat.bind(this)}
                      dataField="questionSet"
                      dataFormat={this.getQuestion}
                      dataSort={true}
                    >
                      Questions
                    </TableHeaderColumn>
                  </BootstrapTable>
                )}
          </CardBody>
        </Card>
      </div>
    );
  }
}
export const mapStateToProps = state => {
  return {
    userSession: state.session.user,
    allQuestionReports: state.userReducer.questionReport
  };
};
export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionsReport);
