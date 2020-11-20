import React, { Component } from "react";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import {
  Card,
  CardBody,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { DateTimePicker } from "react-widgets";
import "react-widgets/dist/css/react-widgets.css";
import Moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import * as baseConstants from "../../constants";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
class UpcomingModel extends Component {
  constructor(props) {
    super(props);
    let len = this.props.row.interviewStatus.length -1;
    this.state = {
      associateName: "",
      competency: [],
      client: "",
      clientFeedback: "",
      clientGroup: "",
      id: "",
      interviewDate: "",
      rmgRRFID: "",
      skill: [],
      message: "",
      open: true,
      statusName: [],
      selectedStatus: [],
      dropDownValue: "Select Status",
      token: {},
      flag: false,
      emailId:"",
      defaultStatus: this.props.row.interviewStatus[len].statusId
    };
    this.interviewDateFormat = this.interviewDateFormat.bind(this);
    this.updateBtn = this.updateBtn.bind(this);
    this.notify = this.notify.bind(this);      
  }
  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.close();
  };

  componentDidMount() {
    let data = {
      tokenType: this.props.tokenData.tokenType,
      accessToken: this.props.tokenData.accessToken
    };
    this.setState(
      {
        token: data
      },
      () => {
        this.getaDataApi("/status/all");
      }
    );
    let row = this.props.row;
    const date = this.interviewDateFormat(row.interviewDate);
    this.setState({
      associateName: row.associateName,
      competency: row.skill.skillName,
      client: row.client,
      clientFeedback: row.clientFeedback,
      clientGroup: row.clientGroup,
      id: row.id,
      //selectedStatus: row.interviewStatus.status,
      interviewDate: row.interviewDate,
      rmgRRFID: row.rmgRRFID,
      emailId: row.toEmailId
    });
  }

  getaDataApi = concatUrl => {
    let url = baseConstants.BASE_URL + concatUrl;

    axios
      .get(url, {
        headers: {
          Authorization:
            this.state.token.tokenType + " " + this.state.token.accessToken,
          ContentType: "application/json"
        }
      })
      .then(res => {
        let interviewStatusList = [];
        res.data.map(d => {
          if (
            d.statusName === "SCHEDULED" ||
            d.statusName === "RESCHEDULED" ||
            d.statusName === "CANCELLED" ||
            d.statusName === "ONHOLD"
          )
            interviewStatusList.push({ id: d.id, statusName: d.statusName });
        });
        this.setState({
          statusName: interviewStatusList
        });
      })
      .catch(error => {
        console.log("error ==>", error);
      });
  };
  notify = successMsg => toast.success(successMsg, { hideProgressBar: true });
  notifyError = errorMsg => {
    toast.error(errorMsg, { hideProgressBar: true });
  };
  updateBtn = e => {
    e.preventDefault();
    let selectedStatus1 = {};
    let data, successMsg, msg;
    let {
      associateName,
      competency,
      client,
      clientGroup,
      interviewDate,
      rmgRRFID,
      id,
      statusName,
      selectedStatus,
      defaultStatus
    } = this.state;
    statusName.map((status, index) => {
      if (status.id == selectedStatus) {
        selectedStatus1 = status;
      }
    });
    if (interviewDate < new Date()) {
      this.notifyError("Interview Date should be Future date.");
      return false;
    } else if (
      associateName &&
      competency &&
      client &&
      clientGroup &&
      interviewDate &&
      rmgRRFID &&
      id
    ) {
      try {
        interviewDate = Moment(interviewDate).format("YYYY/MM/DD");        
        data = {
          associateName,
          competency,
          client,
          clientGroup,
          id: id,
          interviewDate,
          statusName: (selectedStatus1 && selectedStatus1.id) ? selectedStatus1.id : defaultStatus,
          rmgRRFID
        };   
        axios
          .put(baseConstants.BASE_URL + "/interviews/statusUpdate", data, {
            headers: {
              Authorization:
                this.state.token.tokenType + " " + this.state.token.accessToken,
              ContentType: "application/json"
            }
          })
          .then(res => {
            if (res.status === 200) {
              successMsg = "Interview Updated Successfully!";
              this.setState({
                data,
                flag: false
              });
              this.props.upcomingAction(this.props.actionData);
              this.notify(successMsg);
              this.closeModal();
            } else {
              msg = res.data.message;
              this.notifyError(msg);
            }
          })
          .catch(error => {
            if (error.response) {
              msg = error.response.data.message;
            } else {
              msg = "Connection Refused by Server..!!";
            }
            this.setState({ error: "" }, () => {
              this.notifyError(msg);
            });
          });
      } catch (e) {
        console.log("error =>", e);
      }
    }
  };

  interviewDateFormat = data => {
    try {
      if (data) {
        return Moment(data).format("YYYY/MM/DD");
      }
    } catch (error) {
      return "N/A";
    }
  };
  render() {
    let { open, selectedStatus } = this.state;
    const message = this.props.message;
    let element = this.props.row.interviewStatus.length - 1;
    if (this.state.open === false) {
      return <Redirect to="/upcoming" />;
    }
    const statusStyle = {
      color: "#000000",
      "background-color": "#D3D3D3"
    };

    this.dropdownOptions =
      this.state.statusName &&
      this.state.statusName.map(data => {
        let interviewStatus = this.props.row.interviewStatus[element].status;
        if (interviewStatus != data.statusName) {
          return <option value={data.id}>{data.statusName}</option>;
        }
      });
    return (
      <div className="app flex-row align-items-center">
        <Modal isOpen={open}>
          <ToastContainer
            position="bottom-right"
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
                    <Form>
                      <h1>Update Status</h1>
                      <p className="text-muted label-updateUser"></p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          disabled
                          placeholder="associateName"
                          autoComplete="associateName"
                          value={this.state.associateName}
                          onChange={event => {
                            this.setState({
                              associateName: event.target.value,
                              error: "none"
                            });
                          }}
                        />
                      </InputGroup>

                      <p className="text-muted label-updateUser"></p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Competency</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          disabled
                          placeholder="competency"
                          autoComplete="competency"
                          value={this.state.competency}
                          onChange={event => {
                            this.setState({
                              competency: event.target.value,
                              error: "none"
                            });
                          }}
                        />
                      </InputGroup>

                      <p className="text-muted label-updateUser"></p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            Interview Date <span color="danger"> * </span>
                          </InputGroupText>
                        </InputGroupAddon>
                        <DateTimePicker
                          className="dateTimePicker"
                          min={new Date()}
                          defaultValue={new Date(this.state.interviewDate)}
                          onChange={e => {
                            if (e < new Date()) {
                              this.notifyError(
                                "Interview Date should be Future date."
                              );
                            } else {
                              this.setState({
                                interviewDate: e
                              });
                            }
                          }}
                          time={false}
                        />
                        {/* <Input
                          type="text"
                          placeholder="interviewDate"
                          autoComplete="interviewDate"
                          value={this.state.interviewDate}
                          onChange={event => {
                            this.setState({
                              interviewDate: event.target.value,
                              error: "none"
                            });
                          }}
                        /> */}
                      </InputGroup>

                      <p className="text-muted label-updateUser"></p> 
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Client</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" disabled placeholder="client" autoComplete="client" value={this.state.client}
                          onChange={event => {
                            this.setState({
                              client: event.target.value,
                              error: "none"
                            });
                          }}
                        />
                      </InputGroup>

                      <p className="text-muted label-updateUser"></p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Client Group</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          disabled
                          placeholder="clientGroup"
                          autoComplete="clientGroup"
                          value={this.state.clientGroup}
                          onChange={event => {
                            this.setState({
                              clientGroup: event.target.value,
                              error: "none"
                            });
                          }}
                        />
                      </InputGroup>

                      <p className="text-muted label-updateUser"></p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>@</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          disabled
                          placeholder="Email"
                          autoComplete="Email"
                          value={this.state.emailId}
                          onChange={event => {
                            this.setState({
                              emailId: event.target.value,

                              error: "none"
                            });
                          }}
                        />
                      </InputGroup>

                      <p className="text-muted label-updateUser"></p>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>Status</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="select"
                          value={this.state.selectedStatus}
                          onChange={event => {
                            this.setState({
                              selectedStatus: event.target.value,
                              flag: true
                            });
                          }}
                        >
                          <option>
                            {this.props.row.interviewStatus &&
                              this.props.row.interviewStatus[element].status}
                          </option>
                          {this.dropdownOptions}
                           {/* <option value="">Please select</option>
                              {this.state.statusName.map((status, key) => {
                                return (
                                  <option key={key} value={status.id}>
                                    {status.statusName}
                                  </option>
                                );
                              })} */}
                        </Input>
                      </InputGroup>

                      <div style={{ marginTop: "4%" }}>
                        <p className="text-muted label-updateUser"></p>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>rmgRRFID</InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            disabled
                            placeholder="rmgRRFID"
                            autoComplete="Email"
                            value={this.state.rmgRRFID}
                            onChange={event => {
                              this.setState({
                                rmgRRFID: event.target.value,

                                error: "none"
                              });
                            }}
                          />
                        </InputGroup>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="modelFooter">
            <Button
              type="submit"
              variant="info"
              onClick={e => this.updateBtn(e)}
            >
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
}

export const mapStateToProps = state => {
  return {
    upcoming: state.userReducer.upcomingData
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(UpcomingModel);
