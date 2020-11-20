import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { bindActionCreators } from "redux";
import * as baseConstants from "../../constants";
import axios from "axios";
import { Table, Badge } from "reactstrap";
import ViewFeedback from "../ViewFeedback";
import ClientFeedback from "../ViewFeedback/client";
class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackList: ["Pending", "Sent Reminder", "Submitted"],
      searchData: {
        clientGroupName: "",
        clientName: "",
        feedbackByAssociate: "",
        feedbackByClient: "",
        interviewDate: "",
        interviewMode: "",
        userName: "",
        flag: false
      },
      searchList: [],
      accessToken: "",
      tokenType: "",
      questions: null,
      active: false
    };
    this.getData = this.getData.bind(this);
    this.setData = this.setData.bind(this);
  }

  componentDidMount() {
    let { accessToken, tokenType } = this.props.userSession;
    this.setState({
      accessToken: accessToken,
      tokenType: tokenType
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.getData();
    }
  }
  closeModal = () => {
    this.setState({
      active: false,
      questions: null,
      showClientFeedback: false
    });
  };
  getData() {
    let url = baseConstants.BASE_URL + "/associates/search/" + this.props.id;
    axios
      .get(url, {
        headers: {
          Authorization: this.state.tokenType + " " + this.state.accessToken
        }
      })
      .then(res => {
        const searchList = res.data;
        this.setState({
          searchList
        });
        this.setData(searchList);
      })
      .catch(error =>
        this.setState({
          flag: false
        })
      );
  }

  setData(searchList) {
    if (searchList) {
      this.setState({
        searchList,
        flag: true
      });
    } else {
      this.setState({
        searchList: {},
        flag: false
      });
    }
  }
  clientModal = data => {
    this.setState({
      showClientFeedback: data
    });
  };
  format = clientFeedback => {
    let status =
      clientFeedback[clientFeedback.length - 1].clientFeedbackStatusEnum;
    if (status === "SELECTED") {
      return (
        <Fragment>
          <Badge color="success">Selected</Badge>
          <i
            class="fa fa-eye mlft10"
            onClick={this.clientModal.bind(this, clientFeedback)}
          ></i>
        </Fragment>
      );
    } else if (status === "REJECTED") {
      return (
        <Fragment>
          <Badge color="danger">Rejected</Badge>
          <i
            class="fa fa-eye mlft10"
            onClick={this.clientModal.bind(this, clientFeedback)}
          ></i>
        </Fragment>
      );
    } else if (status === "ONHOLD") {
      return (
        <Fragment>
          <Badge color="warning">On Hold</Badge>
          <i
            class="fa fa-eye mlft10"
            onClick={this.clientModal.bind(this, clientFeedback)}
          ></i>
        </Fragment>
      );
    } else if (status === "SCHEDULED") {
      return (
        <Fragment>
          <Badge color="info">Scheduled</Badge>
          <i
            class="fa fa-eye mlft10"
            onClick={this.clientModal.bind(this, clientFeedback)}
          ></i>
        </Fragment>
      );
    }
    else if (status === "RESCHEDULED") {
      return (
        <Fragment>
          <Badge color="info">Re-Scheduled</Badge>
          <i
            class="fa fa-eye mlft10"
            onClick={this.clientModal.bind(this, clientFeedback)}
          ></i>
        </Fragment>
      );
    }
    else if (status === "CANCELLED") {
      return (
        <Fragment>
          <Badge color="info">Cancelled</Badge>
          <i
            class="fa fa-eye mlft10"
            onClick={this.clientModal.bind(this, clientFeedback)}
          ></i>
        </Fragment>
      );
    }
  };
  sendReminder = () => {
    console.log("send Reminder");
  };
  viewFeedback = data => {
    this.setState({
      active: true,
      questions: data
    });
  };
  render() {
    const searchList = this.state.searchList;
    let { questions, active, showClientFeedback } = this.state;
    try {
      if (this.state.flag) {
        return (
          <div>
            <Table hover bordered striped responsive size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Client Name</th>
                  <th>Client Group Name</th>
                  <th>Interview Date</th>
                  <th>Mode of Interview </th>
                  <th>Client Feedback</th>
                  <th>Associate Feedback</th>
                </tr>
              </thead>
              <tbody>
                {searchList.map((searchItem, index) => (
                  <tr>
                    <td>{searchItem.associateName}</td>
                    <td>{searchItem.client}</td>
                    <td>{searchItem.clientGroup} </td>
                    <td>{searchItem.interviewDate}</td>
                    <td>{searchItem.interviewMode}</td>
                    {searchItem.clientFeedbackResponseDtos &&
                    searchItem.clientFeedbackResponseDtos.length > 0 ? (
                      <td>
                        {this.format(searchItem.clientFeedbackResponseDtos)}
                      </td>
                    ) : (
                      <td>
                        <Badge color="warning">Not Submitted</Badge>
                      </td>
                    )}
                    <td>
                      {searchItem.feedbackByAssociate == "TO-DO" ||
                      searchItem.associateFeedbackResponseDto.questions[0] ==
                        undefined ? (
                        <Badge color="warning" onClick={this.sendReminder}>
                          Sent Reminder
                        </Badge>
                      ) : (
                        <a
                          className="badge_search"
                          onClick={() => {
                            this.viewFeedback(
                              searchItem.associateFeedbackResponseDto.questions
                            );
                          }}
                        >
                          View Feedback
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {active && (
              <ViewFeedback
                questions={questions}
                active={active}
                closeModal={this.closeModal}
              />
            )}
            {showClientFeedback && (
              <ClientFeedback
                feedback={showClientFeedback}
                active={showClientFeedback}
                closeModal={this.closeModal}
              />
            )}
          </div>
        );
      } else if(this.state.flag == false)
      {
        return <h5 className="errors">No Interview Records Found.</h5>
      }else return (null);
    } catch (error) {
      console.log(error);
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    userSession: state.session.user
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchItem);
