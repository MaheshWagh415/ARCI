import React, { Component } from "react";
import { Card, CardBody, Row, Button, Form, Label, Badge, Col } from "reactstrap";
import { DateTimePicker } from "react-widgets";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import Moment from "moment";
import axios from "axios";
import momentLocalizer from "react-widgets-moment";
import AssociateFeedbackModal from "./associatefeedback";
import "react-widgets/dist/css/react-widgets.css";
import * as constants from "../../constants";
// import * as CONSTANT from "../../lib";
import ClientFeedbackModal from "./clientFeedback";
import ViewClientFeedbackModal from "./viewClientFeedback";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";


Moment.locale("en");
momentLocalizer();

class Past extends Component {
  constructor(props) {
    super(props);
    var date = new Date();
    let todate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - 1
    );
    let fromdate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth() - 1,
      date.getUTCDate()
    );

    this.state = {
      pastData: null,
      toDate: todate,
      fromDate: fromdate
    };
  }
  createCustomExportCSVButton = onClick => {
    let { csvData } = this.state;
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
  };

  componentDidMount() {
    let { accessToken, tokenType } = this.props.userSession;    
    let data = {
      from_date: Moment(this.state.fromDate).format("DD/MM/YYYY"),
      to_date: Moment(this.state.toDate).format("DD/MM/YYYY"),
      accessToken,
      tokenType
    };
    this.props.pastDataAction(data);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.pastData && nextProps.pastData.status) {
      return true;
    } else {
      return false;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    let { data, status, message } = this.props.pastData;

    if (prevProps != this.props && status === 200) {
      let tempData = [];
      let csvData = [
        [
          "Sr No",
          "Associate Name",
          "Competency",
          "Interview Date",
          "Client Name",
          "ClientGroup Name",
          // "status",
         "Associate Feedback",
          "RRFID"
        ]
      ];


      data.map((data, index) => {
        tempData.push({ ...data, index: ++index });
        let arr = [
          index,
          data.associateName,
          data.skill.skillName,
          Moment(data.interviewDate).format("DD/MM/YYYY"),
          data.client,
          data.clientGroup,
          // data.interviewStatus[0].status,
          data.feedback,
          data.rmgRRFID
        ];
        csvData.push(arr);
        });
      this.setState({
        pastData: tempData,
        csvData: csvData
      });
    } else if (prevProps != this.props && status !== 200) {
      console.log("error message ->", message, status);
    }
  }

  associateActions(cell, row) {
    let disableFlag,
      clientFeedbackStatus = row.clientFeedbackStatus;    
    if (
      clientFeedbackStatus == "ONHOLD" ||
      clientFeedbackStatus == "RESCHEDULED" ||
      clientFeedbackStatus == "CANCELLED"
    ) {
      disableFlag = clientFeedbackStatus;
    }

    if (disableFlag) {
      return <Badge color="secondary">{disableFlag}</Badge>;
    } else if (row.feedback === "PENDING") {
      return (
        <div>
          <a
            href="javascript:void(0);"
            onClick={() => this.sortFunc(row.id)}
            style={{ padding: "2%" }}
          >
            {constants.PAST.PENDING}
          </a>
          {/* <Button color="info" id={row.id} onClick={() =>
          this.sortFunc(row.id)

        } style={{ padding: "2%" }}>{constants.PAST.PENDING} </Button> */}
        </div>
      );
    } else if (row.feedback === "SENT_REMINDER") {
      return <Badge color="warning">{constants.PAST.SENT_REMINDER}</Badge>;
    } else if (row.feedback === "SUBMITED") {
      //   return <Badge color="warning">{constants.PAST.SUBMITED}</Badge>;
      // }else {
      return (
        <div>
          {/* <Button style={{ padding: "2%" }}>View Feedback </Button> */}
          <AssociateFeedbackModal buttonLabel="View" feedbackid={row.id} />
        </div>
      );
    }
  }

  clientActions = (cell, row) => {

    if (row.clientFeedbackStatus === "PENDING") {
      return (
        <div>
          <ClientFeedbackModal pastState={this} data={row} />
        </div>
      );
    } else {
      return (
        <div>
          <ViewClientFeedbackModal pastState={this} data={row} />
        </div>
      );
    }
  };

  getSkillName(cell, row) {
    try {
      if (cell) {
        return cell.skillName;
      }
    } catch (error) {
      return "N/A";
    }
  }
  format = (cell, row) => {
    let comp, myStatus;
    try {
      let myRow = row.interviewStatus[0];
      // console.log(myRow);
      if (myRow) {
        myStatus = myRow.status;
      }
      if (myStatus === "REJECTED") {
        comp = <Badge color="danger">Rejected</Badge>;
      } else if (myStatus === "SELECTED") {
        comp = <Badge color="success">Selected</Badge>;
      } else if (myStatus === "ONHOLD") {
        comp = <Badge color="warning">On Hold</Badge>;
      } else if (myStatus === "SCHEDULED") {
        comp = <Badge color="info">Scheduled</Badge>;
      }
    } catch (error) {
      return "N/A";
    }
    return comp;
  };

  submitBtn = event => {
    event.preventDefault();
    this.getPastData();
  };

  getPastData = () => {
    let { accessToken, tokenType } = this.userSession
      ? this.userSession
      : this.props.userSession;

    let data = {
      from_date: Moment(this.state.fromDate).format("DD/MM/YYYY"),
      to_date: Moment(this.state.toDate).format("DD/MM/YYYY"),
      accessToken,
      tokenType
    };

    this.props.pastDataAction(data);
  };

  askForFeedback = id => {
    console.log("askForFeedback", id);

    let { accessToken, tokenType } = this.props.userSession;
    let url = constants.BASE_URL + "/notification/sendFeedback/" + id;

    this.props.spinnerAction(true);

    axios
      .post(url, null, {
        headers: { Authorization: tokenType + " " + accessToken }
      })
      .then(success => {
        this.getPastData();

        this.props.spinnerAction(false);
        toast.success("Reminder Sent Successfully!");
        console.log(success);
      })
      .catch(error => {
        this.props.spinnerAction(false);
        toast.error("Something went wrong, Please try again!");
        let apiError = error.response.data;
        console.log(apiError);
      });
  };

  interviewDateFormat = data => {
    try {
      return Moment(data).format("DD/MM/YYYY");
    } catch (error) {
      return "N/A";
    }
  };
  onSearchChange = (searchText)=>{
    let { data } = this.props.pastData;
    var tempData = [];
    var searchVal = searchText.toLowerCase();
    let csvData = [
      [
        "Sr No",
        "Associate Name",
        "Competency",
        "Interview Date",
        "Client Name",
        "ClientGroup Name",
        // "status",
       "Associate Feedback",
        "RRFID"
      ]
    ];
    data.map((associateN, index) => {
      
      let associateNameLowerCase = associateN.associateName.toLowerCase();
      if( searchVal == associateNameLowerCase){
        tempData.push({ ...associateN, index: ++index });
        var dataNewObj = [
          index,
          associateN.associateName,
          associateN.skill.skillName,
          Moment(associateN.interviewDate).format("DD/MM/YYYY"),
          associateN.client,
          associateN.clientGroup,
          associateN.feedback,
          // associateN.interviewStatus.length > 0
          //   ? associateN.interviewStatus[0].status
          //   : "",
            
            associateN.rmgRRFID
        ];
        csvData.push(dataNewObj);
        this.setState({
          csvData: csvData,
          data1: tempData
        });
      }
      else if (associateNameLowerCase.includes(searchVal)) {
        tempData.push({ ...associateN, index: ++index });
        var dataNewObj = [
          index,
          associateN.associateName,
          associateN.skill.skillName,
          Moment(associateN.interviewDate).format("DD/MM/YYYY"),
          associateN.client,
          associateN.clientGroup,
          associateN.feedback,
          // associateN.interviewStatus.length > 0
          //   ? associateN.interviewStatus[0].status
          //   : "",
            
            associateN.rmgRRFID
        ];
        csvData.push(dataNewObj);
        this.setState({
          csvData: csvData,
          data1: tempData
        });
      }
    })
    if(tempData.length<=0){
      this.setState({ csvData: "There is no data to display" });
    }
  }

  render() {
    let { pastData } = this.state;
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
          value: pastData && pastData.length
        }
      ], // you can change the dropdown list for size per page
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "Prev", // Previous page button text
      nextPage: "Next", // Next page button text
      firstPage: "First", // First page button text
      lastPage: "Last", // Last page button text
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: "bottom", // default is bottom, top and both is all available
      exportCSVBtn: this.createCustomExportCSVButton,
      onSearchChange: this.onSearchChange
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
    };
    var maxDate = new Date();
    maxDate = maxDate.setDate(maxDate.getDate() - 1);

    return (
      <div className="animated fadeIn" style={{ backgroundColor: "#FFF" }}>
        <Card>
        <CardBody className="upcoming-table">
          <Form className="customForm"
            onSubmit={this.submitBtn}
            //style={{ marginLeft: "14%", marginTop: "2%" }}
          >
            <Row>
              <Col md={{ span: 3, offset: 2 }}>
              <Label className="customFormLabel">
                From Date
              </Label>
              <DateTimePicker
                className="dateTimePicker"
                value={this.state.fromDate}
                time={false}
                max={maxDate}
                onChange={value => this.setState({ fromDate: value })}
              />
              </Col>
              <Col md={3}>
              <Label
                className="customToLabel"
              >
                To Date
              </Label>
              <DateTimePicker
               className="dateTimePicker"
                value={this.state.toDate}
                time={false}
                max={maxDate}
                onChange={value => this.setState({ toDate: value })}
              />
              </Col>
              <Col md={1} style={{ zIndex: "999" }}>
              <Button>
                Submit
              </Button>
              </Col>
            </Row>
          </Form>
        
            {/* <button style={{ marginLeft: "37%" }}>Click to apply text filter</button> */}
            {pastData && (
              <BootstrapTable
              className="bootStrapTable"
                ref="table"
                search={true}
                data={pastData}
                options={options}
                pagination
                exportCSV={true}
                searchPlaceholder='Search by name'
              >
                <TableHeaderColumn
                  dataField="index"
                  width={'8%'}
                  dataAlign="center"
                  isKey={true}
                >
                  #
                </TableHeaderColumn>
                <TableHeaderColumn dataField="associateName" dataAlign="center">
                  Associate Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="skill"
                  dataFormat={this.getSkillName}
                  dataAlign="center"
                >
                  Competency
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="interviewDate"
                  dataFormat={this.interviewDateFormat}
                  width="10%"
                  dataAlign="center"
                  dataSort={true}
                >
                  Interview Date
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="client"
                  dataAlign="center"
                  dataSort={true}
                >
                  Client
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="clientGroup"
                  width="10%"
                  dataAlign="center"
                  dataSort={true}
                >
                  Client Group
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.format}
                  dataAlign="center"
                  dataSort={true}
                >
                  Interview Status
                </TableHeaderColumn>
                <TableHeaderColumn
                  sortFunc={this.askForFeedback}
                  dataField="data"
                  dataFormat={this.associateActions}
                  dataAlign="center"
                >
                  Associate Feedback
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.clientActions}
                  dataAlign="center"
                >
                  Client Feedback
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="rmgRRFID"
                  dataAlign="center"
                  dataSort={true}
                >
                  RRFID
                </TableHeaderColumn>
              </BootstrapTable>
            )}
          </CardBody>
        </Card>
        {/*<ModalExample buttonLabel="View Feedback" feedbackid="1" /> */}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Past);
