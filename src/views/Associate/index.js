import React, { Component, Fragment } from "react";
import { Form, Button, Badge, Card, CardBody } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Moment from "moment";
import Module from "./module";
import Success from "./success";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import ViewFeedback from "../ViewFeedback";
Moment.locale("en");
momentLocalizer();
class AssociateDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeInterviewId: null,
      skills: null,
      showForm: null,
      data: null,
      activeFeedback: null,
      questions: null
    };
  }
  componentDidMount() {
    this.getAssociateData();
    this.props.spinnerAction(true);
  }
  getAssociateData = () => {
    let { accessToken, tokenType } = this.props.userSession;
    let data = {
      accessToken,
      tokenType
    };
    if (!this.props.skills) {
      this.props.getSkillAction(data);
    }
    this.props.getAssociateDataAction(data);
  };
  closeModal = () => {
    this.setState({
      activeInterviewId: null,
      showForm: false,
      successMsg: null,
      activeFeedback: false,
      questions: null
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.dashboard && this.props.dashboard.status) {
      let { data, status } = this.props.dashboard;
      if (prevProps !== this.props && status === 200) {
        let tempData = [];
        data.map((data, index) => {
          data.associateFeedbackResponseDto.interviewDate = data.interviewDate;
          tempData.push({ ...data, index: ++index });
        });
        this.setState(
          {
            data: tempData
          },
          () => {
            this.props.resetDashboardAction();
            this.props.spinnerAction(false);
          }
        );
      }
    } else if (prevProps != this.props && this.props.dashboard) {
      this.setState(
        {
          data: null,
          error: this.props.dashboard
        },
        () => {
          this.props.spinnerAction(false);
        }
      );
    }
    if (this.props.skills && this.props.skills.status) {
      let { data, status } = this.props.skills;
      if (
        prevProps !== this.props &&
        status === 200 &&
        this.state.skills === null
      ) {
        this.setState({
          skills: data
        });
      }
    }
    if (
      prevProps != this.props &&
      this.state.successMsg == null &&
      this.props.interview_que &&
      this.props.interview_que.status === 200
    ) {
      let { message } = this.props.interview_que.data;
      this.setState(
        {
          successMsg: message
        },
        () => {
          this.props.spinnerAction(false);
          this.getAssociateData();
        }
      );
    }
  }
  viewFeedback = questions => {
    this.setState({
      activeFeedback: true,
      questions
    });
  };
  feedback = (data) => {
    let id = data.interviewId,
      newDate = (data.interviewDate).split("/"),    
      questions = data.questions, interviewDate = Moment(data.interviewDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
      todayDate = Moment().format("DD/MM/YYYY"), flag = 0;  
      console.log(newDate)             
    let array2 = interviewDate.split("/"), array1 = todayDate.split("/");       
    for (let i = array1.length - 1; i >= 0; i--) {         
        if(array2[i] < array1[i]) {          
          flag = 1;
          break;
        }
    }
    if (questions && questions[0] != null) {
      return (
        <a
          className="badge_search"
          onClick={this.viewFeedback.bind(this, questions)}
        >
          View Feedback
        </a>
      );
    } else if (questions && questions[0] == null && flag == 1) {
      return (
        <Button
          className="record_feedback"
          onClick={() => {
            this.setState({
              activeInterviewId: id,
              showForm: true
            });
          }}
          id={id}
          color="warning"
        >
          Record Feedback
        </Button>
      );
    }
    else {
      return (<Badge color="secondary">Interview Pending</Badge>);
    }
  };
  interviewDateFormat = data => {
    try {
      data = Moment(data, "DD/MM/YYYY").format("DD-MMM-YYYY");
    } catch (error) {
      data = "N/A";
    }
    return data;
  };
  render() {
    let {
      data,
      showForm,
      skills,
      activeInterviewId,
      successMsg,
      activeFeedback,
      questions,
      error
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
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: "bottom" // default is bottom, top and both is all available
    };
    return (
      <Fragment>
        <div className="animated fadeIn associate-dashboard">
          <Card>
            <CardBody>
              <h2>Associate Interview History</h2>
              {data ? (
                <BootstrapTable
                  data={data}
                  isKey={true}
                  ref="table"
                  className="associateTable"
                  pagination
                  keyField="id"
                  options={options}
                  search={false}
                  exportCSV={false}
                >
                  <TableHeaderColumn
                    width={"8%"}
                    dataField="index"
                    dataSort={true}
                  >
                    #
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="client" dataSort={true}>
                    Client Name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="clientGroup" dataSort={true}>
                    Client Group
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="interviewDate"
                    dataFormat={this.interviewDateFormat.bind(this)}
                    dataSort={true}
                  >
                    Interview Date
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="associateFeedbackResponseDto"
                    dataFormat={this.feedback.bind(this)}
                    dataSort={true}
                  >
                    Feedback
                  </TableHeaderColumn>
                </BootstrapTable>
              ) : (
                  <h4 align="center">{error}</h4>
                )}
              {showForm && activeInterviewId && (
                <Module
                  active={showForm}
                  closeModal={this.closeModal}
                  UserSkills={skills}
                  interviewId={activeInterviewId}
                  token={this.props.userSession}
                ></Module>
              )}
              {successMsg && (
                <Success
                  active={successMsg}
                  closeModal={this.closeModal}
                ></Success>
              )}
              {activeFeedback && questions && (
                <ViewFeedback
                  questions={questions}
                  active={activeFeedback}
                  closeModal={this.closeModal}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export const mapStateToProps = state => {
  return {
    // dashboard: state.associateReducer.associateData,
    dashboard: state.associateReducer.associateDashboard,
    userSession: state.session.user,
    skills: state.associateReducer.skillData,
    interview_que: state.associateReducer.interview_que
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(AssociateDashboard);
