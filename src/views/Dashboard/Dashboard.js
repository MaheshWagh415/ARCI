import React, { Component } from "react";
import { Form, Col, Label, Button } from "reactstrap";
import { Badge, Card, CardBody, Row } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import { CSVLink } from "react-csv";
Moment.locale("en");
momentLocalizer();

class Tables extends Component {
  constructor(props) {
    super(props);
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let toDate = new Date(year, month + 1, day);
    
    this.state = {
      data: null,
      fromDate: new Date(Moment().subtract(2,'months')),
      toDate
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
    let startdate = Moment().format("DD-MM-YYYY");
    let new_date = Moment(startdate, "DD-MM-YYYY")
      .add(1, "month")
      .calendar();
    startdate = Moment().subtract(2,'months').format("DD/MM/YYYY hh:mm:ss");
    new_date = Moment(new_date).format("DD/MM/YYYY hh:mm:ss");    
    let data = {
      from_date: startdate,
      to_date: new_date,
      accessToken,
      tokenType
    };
    this.props.spinnerAction(true);
    setTimeout(() => {
      this.props.dashboardAction(data);
    }, 500);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.dashboard && this.props.dashboard.status) {
      let { data, status } = this.props.dashboard;
      if (prevProps !== this.props && status === 200) {
        let tempData = [];
        let csvData = [
          [
            "Sr No",
            "Associate Name",
            "Competency",
            "Interview Date",
            "Client Name",
            "ClientGroup Name",
            "Interview Status",
            // "email",
           // "rmgRRFID"
          ]
        ];

        data.interviews.map((data, index) => {
          tempData.push({ ...data, index: ++index });
          let arr = [
            index,
            data.associateName,
            data.skill.skillName,
            Moment(data.interviewDate).format("DD/MM/YYYY"),
            data.client,
            data.clientGroup,
            data.interviewStatus[0] && data.interviewStatus[0].status,
            data.clientFeedback,
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

  format = (cell, row) => {
    let comp, myStatus;
    try {
      let myRow = row[0];
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
      }else if (myStatus === "RESCHEDULED") {
        return <Badge color="info">Rescheduled</Badge>;
      } else if (myStatus === "CANCELLED") {
        return <Badge color="info">Cancelled</Badge>;
      }
    } catch (error) {
      comp = "N/A";
    }
    return comp;
  };
  interviewDateFormat = data => {
    try {
      return Moment(data).format("DD/MM/YYYY");
    } catch (error) {
      data = "N/A";
    }
    return data;
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

  formSubmit = () => {
    let { accessToken, tokenType } = this.props.userSession;
    let { fromDate, toDate } = this.state;
    fromDate = Moment(fromDate).format("DD/MM/YYYY 00:00:00");
    toDate = Moment(toDate).format("DD/MM/YYYY 23:59:59");
    let data = {
      from_date: fromDate,
      to_date: toDate,
      accessToken,
      tokenType
    };
    this.props.dashboardAction(data);
  };
  DateTimeChange = (e, parm) => {
    this.setState({
      [parm]: e
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.dashboard && nextProps.dashboard.status) {
      return true;
    } else if (nextState != this.state) {
      return true;
    } else {
      return false;
    }
  }
  onSearchChange = (searchText)=>{
    let data = this.state.data;
    var searchVal = searchText.toLowerCase();
    var tempData = [];
    let csvData = [
      [
        "Sr no",
        "Associate Name",
        "Competency",
        "Interview Date",
        "Client Name",
        "ClientGroup Name",
        "Interview Status"
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
          associateN.interviewStatus.length > 0
            ? associateN.interviewStatus[0].status
            : "",
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
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: "bottom", // default is bottom, top and both is all available
      exportCSVBtn: this.createCustomExportCSVButton,
      onSearchChange: this.onSearchChange
    };
    return (
      <div className="animated fadeIn">
        <Card>
          {/* <CardHeader>Dashboard</CardHeader> */}
          <CardBody className="dashboard-table">
            <Form className="customForm">
              <Row>
                <Col md={{ span: 3, offset: 2 }}>
                  <Label className="customFormLabel">From Date</Label>
                  <DateTimePicker
                    className="dateTimePicker"
                    defaultValue={new Date()}
                    value={this.state.fromDate}
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
                <Col md={1} style={{zIndex: "999"}}>
                  <Button className="submit" onClick={this.formSubmit}>
                    Submit
                  </Button>
                </Col>
              </Row>
              </Form>
              {data && (
                <BootstrapTable
                  data={data}
                  isKey={true}
                  ref="table"
                  pagination
                  className="bootStrapTable"
                  keyField="id"
                  options={options}
                  search={true}
                  exportCSV={true}
                  searchPlaceholder='Search by name'
                >
                  <TableHeaderColumn
                    width={'8%'}
                    dataField="index"
                    dataSort={true}
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
                    dataField="interviewDate"
                    dataFormat={this.interviewDateFormat.bind(this)}
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
                    dataField="interviewStatus"
                    dataSort={true}
                    dataFormat={this.format.bind(this, data)}
                  >
                    Interview Status
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
    dashboard: state.userReducer.dashboarddata,
    userSession: state.session.user
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tables);
