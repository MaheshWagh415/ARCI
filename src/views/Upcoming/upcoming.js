import React, { Fragment, Component } from "react";
import {
  Card,
  CardBody,
  Row,
  Badge,
  Col,
  Form,
  Label,
  Button,
  Input,
  InputGroup,
  InputGroupAddon, InputGroupText,
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
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import { CSVLink, CSVDownload } from "react-csv";
import UpcomingModel from "./UpcomingModel";

Moment.locale("en");
momentLocalizer();

class Tables extends Component {
  constructor(props) {
    super(props);
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let toDate = new Date(year, month + 3, day);
    this.state = {
      data: null,
      fromDate: new Date(),
      toDate,
      updateUser: false,
      row: "",
      token: {},
      actionData: {},
      aname: "",
      intDate: "",
      data1: {},
      customSearch:''
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
  createCustomSearchField = props => {
    console.log("ccsf", props);

    return <SearchField className="my-custom-class" value="" onKeyUp={this.props.search} placeholder="Search by name" />;
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.upcoming && nextProps.upcoming.status) {
      return true;
    } else if (nextState != this.state) {
      return true;
    } else {
      return false;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.upcoming && this.props.upcoming.status) {
      let { data, status } = this.props.upcoming;
      if (prevProps != this.props && status === 200) {

        let tempData = [];
        let csvData = [
          [
            "Sr no",
            "Associate Name",
            "Competency",
            "Interview Date",
            "Client Name",
            "ClientGroup Name",
            "Interview Status",
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
            data.interviewStatus.length > 0
              ? data.interviewStatus[0].status
              : "",
            //data.clientFeedback,
            data.rmgRRFID
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
  format = (cell, row) => {
    let myStatus;
    try {
      let statusLen = row.interviewStatus.length;
      if (statusLen) {
        myStatus = row.interviewStatus[statusLen - 1].status;
      }
      if (myStatus === "REJECTED") {
        return <Badge color="danger">Rejected</Badge>;
      } else if (myStatus === "SELECTED") {
        return <Badge color="success">Selected</Badge>;
      } else if (myStatus === "ONHOLD") {
        return <Badge color="warning">On Hold</Badge>;
      } else if (myStatus === "SCHEDULED") {
        return <Badge color="info">Scheduled</Badge>;
      } else if (myStatus === "RESCHEDULED") {
        return <Badge color="info">Rescheduled</Badge>;
      } else if (myStatus === "CANCELLED") {
        return <Badge color="info">Cancelled</Badge>;
      }
    } catch (error) {
      return "N/A";
      console.log(error);
    }
  };
  interviewDateFormat = data => {
    try {
      if (data) {
        return Moment(data).format("DD/MM/YYYY");
      }
    } catch (error) {
      return "N/A";
    }
  };
  emailSend = data => {
    console.log("user Data ==>", data);
  };
  emailStatus = (cell, row) => {
    const divStyle = {
      fontSize: "15px"
    };

    if (row.status === "PENDING") {
      return (
        <i
          className="fa fa-envelope-open-o"
          aria-hidden="true"
          style={divStyle}
        >
          PENDING
        </i>
      );
    } else if (row.status === "SENT") {
      return (
        <i className="fa fa-check-square-o" aria-hidden="true" style={divStyle}>
          SENT
        </i>
      );
    } else if (row.status === "TRY_LIMIT_EXCEEDED") {
      return (
        <i className="fa fa-warning" aria-hidden="true" style={divStyle}>
          TRY_LIMIT
          <br />
          EXCEEDED
        </i>
      );
    } else if (row.status === "FAILED") {
      return (
        <Fragment>
          <i
            className="fa fa-exclamation-circle"
            aria-hidden="true"
            style={divStyle}
          >
            FAILED
          </i>
          &nbsp;&nbsp;
          <i
            className="fa fa-paper-plane"
            onClick={this.emailSend.bind(this, row)}
          ></i>
        </Fragment>
      );
    }
  };
  formSubmit = () => {
    let { accessToken, tokenType } = this.props.userSession;
    let { fromDate, toDate } = this.state;
    fromDate = Moment(fromDate).format("DD-MM-YYYY");
    toDate = Moment(toDate).format("DD-MM-YYYY");
    fromDate = fromDate.replace(/-/g, "/");
    toDate = toDate.replace(/-/g, "/");
    let data = {
      from_date: fromDate,
      to_date: toDate,
      accessToken,
      tokenType
    };
    this.props.upcomingAction(data);
  };
  DateTimeChange = (e, parm) => {
    this.setState({
      [parm]: e
    });
  };
  componentDidMount() {
    let startdate = Moment().format("DD-MM-YYYY");
    let new_date = Moment(startdate, "DD-MM-YYYY")
      .add(1, "months")
      .calendar();
    new_date = Moment(new_date).add(2, "months").format("DD-MM-YYYY");
    startdate = startdate.replace(/-/g, "/");
    new_date = new_date.replace(/-/g, "/");
    let { accessToken, tokenType } = this.props.userSession;
    let data = {
      from_date: startdate,
      to_date: new_date,
      accessToken,
      tokenType
    };
    this.setState({
      token: data,
      actionData: data
    });
    this.props.spinnerAction(true);
    setTimeout(() => {
      this.props.upcomingAction(data);
    }, 500);
  }

  getSkillName(cell, row) {
    try {
      if (cell) {
        return cell.skillName;
      }
    } catch (error) {
      return "N/A";
    }
  }

  buttonFormatter(cell, row, rowIndex, e) {
    return (
      <div>
        <a
          href="javascript:void(0);"
          variant="link"
          onClick={() => this.setState({ updateUser: true, row: row })}
        >
          Update
        </a>
        {/*<Button variant="danger" size="sm" onClick={(e) => this.confirmationDeletePopup(e, row)}>Delete</Button>      */}
      </div>
    );
  }

  closeSucess = () => {
    this.setState({
      sucessMsg: !this.state.sucessMsg,
      updateUser: false
    });
  };
  onSearchChange = (searchText) => {
    //...
    var searchVal = searchText.toLowerCase();
    var tempData = [];
    let data = this.state.data;
    let csvData = [
      [
        "Sr no",
        "Associate Name",
        "Competency",
        "Interview Date",
        "Client Name",
        "ClientGroup Name",
        "Interview Status",
        "RRFID"
      ]
    ];
    data.map((associateN, index) => {

      let associateNameLowerCase = associateN.associateName.toLowerCase();

      if( searchVal === associateNameLowerCase){
        tempData.push({ ...associateN, index: ++index });
        var dataNewObj = [
          index,
          associateN.associateName,
          associateN.skill.skillName,
          Moment(associateN.interviewDate).format("DD/MM/YYYY"),
          associateN.client,
          associateN.clientGroup,
          associateN.interviewStatus.length > 0
            ? associateN.interviewStatus[0].status
            : "",
          //data.clientFeedback,
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
          associateN.interviewStatus.length > 0
            ? associateN.interviewStatus[0].status
            : "",
          //data.clientFeedback,
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
    let { data } = this.state;
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
      exportCSVBtn: this.createCustomExportCSVButton,
      onSearchChange: this.onSearchChange
    };


    return (
      <div className="animated fadeIn">
        <Card>
          {/* <CardHeader>Upcoming Dashboard</CardHeader> */}
          {/* <CardHeader>
                <i className="fa fa-align-justify"></i> Table Data
              </CardHeader> */}
          <CardBody className="upcoming-table">
            <Form className="customForm">
              <Row>
                <Col md={{ span: 3, offset: 2 }}>
                  <Label className="customFormLabel">From Date</Label>
                  <DateTimePicker
                    className="dateTimePicker"
                    value={this.state.fromDate}
                    defaultValue={new Date()}
                    onChange={e => {
                      this.DateTimeChange(e, "fromDate");
                    }}
                    time={false}
                  />
                </Col>
                <Col md={3}>
                  <Label className="customToLabel">To Date</Label>
                  <DateTimePicker
                    className="dateTimePicker"
                    value={this.state.toDate}
                    defaultValue={new Date()}
                    onChange={e => {
                      this.DateTimeChange(e, "toDate");
                    }}
                    time={false}
                  />
                </Col>
                <Col md={1} style={{ zIndex: "999" }}>
                  <Button
                    className="submit"
                    onClick={this.formSubmit}
                    style={{ marginLeft: "2%", zIndex: "999" }}
                  >
                    Submit
                  </Button>
                </Col>
               
              </Row>
              
            </Form>
            {data && (
              <BootstrapTable
                data={data}
                className="bootStrapTable"
                isKey={true}
                ref="table"
                pagination
                keyField="id"
                options={options}
                search={true}
                exportCSV
                searchPlaceholder='Search by name'

              >

                <TableHeaderColumn
                  dataField="index"
                  dataSort={true}
                  width={"8%"}
                >
                  #
                </TableHeaderColumn>
                <TableHeaderColumn dataField="associateName" dataSort={true}>
                  Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="skill"
                  dataFormat={this.getSkillName}
                  dataSort={true}
                >
                  Competency
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.interviewDateFormat.bind(this)}
                  dataField="interviewDate"
                  dataSort={true}
                >
                  Interview Date
                </TableHeaderColumn>
                <TableHeaderColumn dataField="client" dataSort={true}>
                  Client
                </TableHeaderColumn>
                <TableHeaderColumn dataField="clientGroup" dataSort={true}>
                  Client Group
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="emailStatus"
                  dataFormat={this.emailStatus.bind(this)}
                  dataSort={true}
                >
                  Email Status
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="status"
                  dataSort={true}
                  dataFormat={this.format}
                >
                  Interview Status
                </TableHeaderColumn>
                <TableHeaderColumn dataField="rmgRRFID" dataSort={true}>
                  RRFID
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="button"
                  editable={false}
                  dataFormat={this.buttonFormatter.bind(this)}
                >
                  Action
                </TableHeaderColumn>
              </BootstrapTable>
            )}
            {this.state.updateUser && (
              <UpcomingModel
                close={this.closeSucess}
                actionData={this.state.actionData}
                tokenData={this.state.token}
                row={this.state.row}
                notify={this.notify}
              />
            )}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    upcoming: state.userReducer.upcomingData,
    userSession: state.session.user
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Tables);
