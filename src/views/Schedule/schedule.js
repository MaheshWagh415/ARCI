import React, { Component } from "react";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback  
} from "reactstrap";
import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import * as baseConstants from "../../constants";
import CONSTANTS from "../../lib";
import Module from "./module";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Validator from "../validator";
Moment.locale("en");
momentLocalizer();

class Tables extends Component {
  state = { inputValue: "" };
  constructor() {
    super();
    this.formRef = React.createRef();
    this.state = {
      accessToken: "",
      tokenType: "",
      clientName: [],
      clientGroupList: [],
      modeOfInterview: [
        "Telephone Interview",
        "Face-to-Face Interview",
        "Panel Interview",
        "Group Interview",
        "Sequential Interview",
        "Dinner Interview",
        "Competency Based Interviews",
        "Informal Interviews"
      ],
      clientGroup: [],
      skill: [],
      rrfid: {},
      fields: {
        toEmails: [],
        ccEmails: [],
        bccEmails: [],
        pdlEmails: [],
        cName: "",
        groupName: "",
        interviewDate: "",
        mobileNumber: "",
        interviewTime: "",
        deliveryPocName: "",
        comments: "",
        jobDescription: "",
        skillCategory: "",
        clientPocName: "",
        deliveryPocNumber: "",
        modeOfInterview: "",
        interviewVenue: "",
        rrfid: ""
      },
      errors: {
        toEmails: "",
        ccEmails: "",
        bccEmails: "",
        pdlEmails: "",
        cName: "",
        groupName: "",
        interviewDate: "",
        mobileNumber: "",
        interviewTime: "",
        deliveryPocName: "",
        comments: "",
        jobDescription: "",
        skillCategory: "",
        clientPocName: "",
        deliveryPocNumber: "",
        modeOfInterview: "",
        interviewVenue: "",
        interviewDateTime: "",
        rrfid: ""
      },
      invalid: {
        toEmails: false,
        ccEmails: false,
        bccEmails: false,
        pdlEmails: false,
        cName: false,
        groupName: false,
        interviewDate: false,
        mobileNumber: false,
        interviewTime: false,
        deliveryPocName: false,
        comments: false,
        jobDescription: false,
        skillCategory: false,
        clientPocName: false,
        deliveryPocNumber: false,
        modeOfInterview: false,
        interviewVenue: false,
        interviewDateTime: false,
        rrfid: false
      },
      toDate: new Date(),
      showMsg: false,
      selectedOption: null,
      inputValue: "",
      autosuggestRecords: [],
      sucessMsg: false,
      defaultDate: new Date(),
      massge: ""
    };
    this.selectInput = React.createRef();
  }
  DateTimeChange = (e, parm) => {
    let isAfter = Moment(e).isAfter(new Date());
    let errors = {},
      invalid = {};
    errors["interviewDate"] = !isAfter
      ? "You can not schedule interview for Past Date & Time."
      : null;
    errors["interviewDateTime"] = !isAfter
      ? "You can not schedule interview for Past Date & Time."
      : null;
    invalid["interviewDate"] = !isAfter ? true : false;
    invalid["interviewDateTime"] = !isAfter ? true : false;
    let errorstemp = {
      ...this.state.errors,
      ...errors
    };
    let invalidtemp = {
      ...this.state.invalid,
      ...invalid
    };
    if (isAfter) {
      let fields = {
        ...this.state.fields,
        ...{
          interviewDate: Moment(e).format("YYYY-DD-MM"),
          interviewTime: Moment(e)
            .format("LT")
            .split(" ")[0]
        }
      };
      this.setState({
        fields: { ...fields },
        [parm]: e,
        defaultDate: e,
        errors: { ...errorstemp },
        invalid: { ...invalidtemp }
      });
    } else {
      this.setState({ errors: { ...errorstemp }, invalid: { ...invalidtemp } });
    }
  };

  filterColors = (inputValue: string) => {
    return this.state.autosuggestRecords.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
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
            clientName.push({ id: d.id, name: d.clientName });
            d.clientGroups.map(clientg => {
              clientGroupList.push({
                id: clientg.id,
                name: clientg.groupName,
                clientId: d.id
              });
            });
          });

          clientName = this.sortArrayObj(clientName);

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
  promiseOptions = inputValue =>
    new Promise(resolve => {
      let url = baseConstants.BASE_URL + "/api/users/search/" + inputValue;
      axios
        .get(url, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken,
            ContentType: "application/json"
          }
        })
        .then(res => {
          let tempData = [];
          res.data.map((d, i) => {
            if (i < 5) {
              tempData.push({
                value: d.email,
                userid: d.userId,
                label: d.firstName + " " + d.lastName + " <" + d.email + "> "
              });
            }
          });
          this.setState(
            {
              autosuggestRecords: tempData
            },
            () => {
              resolve(this.filterColors(inputValue));
            }
          );
        })
        .catch(error => {
          console.log("error ==>", error);
        });
    });
  componentDidMount() {
    let { accessToken, tokenType } = this.props.userSession;
    this.setState(
      {
        accessToken: accessToken,
        tokenType: tokenType
      },
      () => {
        this.getaDataApi("/skills/all", "skill");
        this.getaDataApi("/client/all", "client");
        this.sortData("modeOfInterview");
      }
    );
  }
  handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, "");
    this.setState({ inputValue });
    return inputValue;
  };
  handleChange = event => {
    let fields = {
      ...this.state.fields,
      ...{ [event.target.name]: event.target.value }
    };

    let p = [event.target.name];
    this.setState({ fields: { ...fields } }, () => {
      this.handleValidation(p);
    });

    if ([event.target.name] == "cName") {
      this.changeClientName([event.target.value]);
    }
  };
  changeClientName = k => {
    let tempData = [];
    this.state.clientGroupList.map(data => {
      if (k == data.clientId) {
        tempData.push({ id: data.id, name: data.name });
      }
    });
    let data = this.sortArrayObj(tempData);
    this.setState({
      clientGroup: data
    });
  };
  handleValidation = param => {
    let fields = this.state.fields;
    let errors = {},
      invalid = {};
    let formIsValid = true,
      numberValidate = /^\d+$/;
    if (
      (param == "jobDescription" && !fields["jobDescription"]) ||
      (param == "all" && !fields["jobDescription"])
    ) {
      formIsValid = false;
      invalid["jobDescription"] = true;
      errors["jobDescription"] = CONSTANTS.ERROR.JOB_DESCRIPTION;
    } else if (fields["jobDescription"]) {
      invalid["jobDescription"] = false;
      errors["jobDescription"] = "";
    }

    // if (
    //   (param == "mobileNumber" && !fields["mobileNumber"]) ||
    //   (param == "all" && !fields["mobileNumber"])
    // ) {
    //   formIsValid = false;
    //   invalid["mobileNumber"] = true;
    //   errors["mobileNumber"] = CONSTANTS.ERROR.MOBILE_NUMBER;
    // } else if (
    //   !numberValidate.test(fields["mobileNumber"]) &&
    //   param == "mobileNumber"
    // ) {
    //   formIsValid = false;
    //   invalid["mobileNumber"] = true;
    //   errors["mobileNumber"] = CONSTANTS.ERROR.MOBILE_NUMBER;
    // } else if (fields["mobileNumber"]) {
    //   invalid["mobileNumber"] = false;
    //   errors["mobileNumber"] = "";
    // }

    if (
      (param == "clientPocName" && !fields["clientPocName"]) ||
      (param == "all" && !fields["clientPocName"]) || (param == "clientPocName" && fields["clientPocName"] && Validator.validateName(fields["clientPocName"]))
    ) {
      formIsValid = false;
      invalid["clientPocName"] = true;
      if(Validator.validateName(fields["clientPocName"])) {
        errors["clientPocName"] = "Client POC Name contains only alphabatic charcters";
      }
      else{
        errors["clientPocName"] = CONSTANTS.ERROR.CLIENT_POC_NAME;
      } 
    } else if (fields["clientPocName"]) {
      invalid["clientPocName"] = false;
      errors["clientPocName"] = "";
    }

    if (
      (param == "skillCategory" && !fields["skillCategory"]) ||
      (param == "all" && !fields["skillCategory"])
    ) {
      formIsValid = false;
      invalid["skillCategory"] = true;
      errors["skillCategory"] = CONSTANTS.ERROR.SKILL_CATEGORY;
    } else if (fields["skillCategory"]) {
      invalid["skillCategory"] = false;
      errors["skillCategory"] = "";
    }
    if (
      (param == "interviewDate" && !fields["interviewDate"]) ||
      (param == "all" && !fields["interviewDate"])
    ) {
      formIsValid = false;
      invalid["interviewDate"] = true;
      errors["interviewDate"] = CONSTANTS.ERROR.INTERVIEW_DATE;
    } else if (fields["interviewDate"]) {
      invalid["interviewDate"] = false;
      errors["interviewDate"] = "";
    }
    // if (
    //   (param == "groupName" && !fields["groupName"]) ||
    //   (param == "all" && !fields["groupName"])
    // ) {
    //   formIsValid = false;
    //   invalid["groupName"] = true;
    //   errors["groupName"] = CONSTANTS.ERROR.GROUP_NAME;
    // } else if (fields["groupName"]) {
    //   invalid["groupName"] = false;
    //   errors["groupName"] = "";
    // }
    if (
      (param == "cName" && !fields["cName"]) ||
      (param == "all" && !fields["cName"])
    ) {
      formIsValid = false;
      invalid["cName"] = true;
      errors["cName"] = CONSTANTS.ERROR.CLIENT_NAME;
    } else if (fields["cName"]) {
      invalid["cName"] = false;
      errors["cName"] = "";
    }
    if (
      (param == "comments" && !fields["comments"]) ||
      (param == "all" && !fields["comments"])
    ) {
      formIsValid = false;
      invalid["comments"] = true;
      errors["comments"] = CONSTANTS.ERROR.COMMENTS;
    } else if (fields["comments"]) {
      invalid["comments"] = false;
      errors["comments"] = "";
    }         
    if (
      (param == "deliveryPocName" && !fields["deliveryPocName"]) 
      ||      (param == "all" && !fields["deliveryPocName"])
   || (param == "deliveryPocName" && fields["deliveryPocName"] && Validator.validateName(fields["deliveryPocName"]))
    ) {
      formIsValid = false;
      invalid["deliveryPocName"] = true;
      if(Validator.validateName(fields["deliveryPocName"])) {
        errors["deliveryPocName"] = "Delivery POC Name contains only alphabatic charcters";
      }
      else {
        errors["deliveryPocName"] = CONSTANTS.ERROR.DELIVERY_POC_NAME;
      }      
    } else if (fields["deliveryPocName"]) {
      invalid["deliveryPocName"] = false;
      errors["deliveryPocName"] = "";
    }
    if (
      (fields["toEmails"] && !fields["toEmails"].length > 0 && param == "toEmails") ||
      (param == "all" && fields["toEmails"] && !fields["toEmails"].length > 0) ||
      (param == "all" && fields["toEmails"] && fields["toEmails"][0] == undefined)
    ) {
      formIsValid = false;
      invalid["toEmails"] = true;
      errors["toEmails"] = CONSTANTS.ERROR.TO_EMAILS;
    } else if (fields["toEmails"] && fields["toEmails"].length > 0) {
      invalid["toEmails"] = false;
      errors["toEmails"] = "";
    }
    // if (
    //   (!fields["ccEmails"].length > 0 && param == "ccEmails") ||
    //   (param == "all" && !fields["ccEmails"].length > 0)
    // ) {
    //   formIsValid = false;
    //   invalid["ccEmails"] = true;
    //   errors["ccEmails"] = CONSTANTS.ERROR.CC_EMAILS;
    // } else if (fields["ccEmails"].length > 0) {
    //   invalid["ccEmails"] = false;
    //   errors["ccEmails"] = "";
    // }
    // if (
    //   (!fields["bccEmails"].length > 0 && param == "bccEmails") ||
    //   (param == "all" && !fields["bccEmails"].length > 0)
    // ) {
    //   formIsValid = false;
    //   invalid["bccEmails"] = true;
    //   errors["bccEmails"] = CONSTANTS.ERROR.BCC_EMAILS;
    // } else if (fields["bccEmails"].length > 0) {
    //   invalid["bccEmails"] = false;
    //   errors["bccEmails"] = "";
    // }
    // if (
    //   (!fields["pdlEmails"].length > 0 && param == "pdlEmails") ||
    //   (param == "all" && !fields["pdlEmails"].length > 0)
    // ) {
    //   formIsValid = false;
    //   invalid["pdlEmails"] = true;
    //   errors["pdlEmails"] = CONSTANTS.ERROR.PDL_EMAILS;
    // } else if (fields["pdlEmails"].length > 0) {
    //   invalid["pdlEmails"] = false;
    //   errors["pdlEmails"] = "";
    // }

    // if (
    //   (param == "deliveryPocNumber" && !fields["deliveryPocNumber"]) ||
    //   (param == "all" && !fields["deliveryPocNumber"])
    // ) {
    //   formIsValid = false;
    //   invalid["deliveryPocNumber"] = true;
    //   errors["deliveryPocNumber"] = CONSTANTS.ERROR.DELIVERY_POC_NUMBER;
    // } else if (
    //   !numberValidate.test(fields["deliveryPocNumber"]) &&
    //   param == "deliveryPocNumber"
    // ) {
    //   formIsValid = false;
    //   invalid["deliveryPocNumber"] = true;
    //   errors["deliveryPocNumber"] = CONSTANTS.ERROR.DELIVERY_POC_NUMBER;
    // } else if (fields["deliveryPocNumber"]) {
    //   invalid["deliveryPocNumber"] = false;
    //   errors["deliveryPocNumber"] = "";
    // }

    if (
      (param == "modeOfInterview" && !fields["modeOfInterview"]) ||
      (param == "all" && !fields["modeOfInterview"])
    ) {
      formIsValid = false;
      invalid["modeOfInterview"] = true;
      errors["modeOfInterview"] = CONSTANTS.ERROR.MODE_OF_INTERVIEW;
    } else if (fields["modeOfInterview"]) {
      invalid["modeOfInterview"] = false;
      errors["modeOfInterview"] = "";
    }
    if (param == "all" && !fields["rrfid"]) {
      formIsValid = false;
      invalid["rrfid"] = "Please Enter RRFID";
      errors["rrfid"] = "Please Enter RRFID";
    } else if (fields["rrfid"]) {
      invalid["rrfid"] = false;
      errors["rrfid"] = "";
    }
    // if (
    //   (param == "interviewVenue" && !fields["interviewVenue"])
    //   // ||
    //   // (param == "all" && !fields["interviewVenue"])
    // ) {
    //   formIsValid = false;
    //   invalid["interviewVenue"] = true;
    //   errors["interviewVenue"] = CONSTANTS.ERROR.INTERVIEW_VENU;
    // } else if (fields["interviewVenue"]) {
    //   invalid["interviewVenue"] = false;
    //   errors["interviewVenue"] = "";
    // }
    let errorstemp = {
      ...this.state.errors,
      ...errors
    };
    let invalidtemp = {
      ...this.state.invalid,
      ...invalid
    };
    this.setState({ errors: { ...errorstemp }, invalid: { ...invalidtemp } });
    return formIsValid;
  };
  handleSubmit = event => {
    event.preventDefault();

    let fields = {
      ...this.state.fields,
      ...{
        interviewDate: Moment(this.state.interviewDateTime).format(
          "YYYY-MM-DD"
        ),
        interviewTime: Moment(this.state.interviewDateTime)
          .format("LT")
          .split(" ")[0]
      }
    };
    this.setState({ fields: { ...fields } }, () => {
      const form = this.state.fields;
      if (this.handleValidation("all")) {
        axios
          .post(
            // baseConstants.BASE_URL + "/scheduleInterview/saveScheduleInterview",
            baseConstants.BASE_URL + "/interviews/schedule",
            form,
            {
              headers: {
                Authorization:
                  this.state.tokenType + " " + this.state.accessToken
              }
            }
          )
          .then(res => {
            if (res.data.success) {
              this.formReset();
            }
            this.setState(
              {
                massge: res.data.message
              },
              () => {
                this.removeScess();
              }
            );
          })
          .catch(error => {
            this.setState(
              {
                error: error.response.data.message
              },
              () => {
                // this.removeScess();
                toast.error(error.response.data.message, {
                  position: "bottom-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true
                });
              }
            );
          });
      }
    });
  };
  sortData = nameofFilde => {
    let obj = {};
    obj[nameofFilde] = this.state[nameofFilde].sort();
    this.setState(obj);
  };
  sortArrayObj = (data, name) => {
    let k = data.sort(function(a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
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

  removeScess = () => {
    this.setState({
      sucessMsg: !this.state.sucessMsg
    });
  };

  formReset = () => {        
    this.selectInput.select.state.value = [];
    this.setState({
      fields: {
        toEmails: [],
        ccEmails: [],
        bccEmails: [],
        pdlEmails: [],
        rrfid: "",
        cName: "",
        groupName: "",
        interviewDate: "",
        mobileNumber: "",
        interviewTime: "",
        deliveryPocName: "",
        comments: "",
        jobDescription: "",
        skillCategory: "",
        clientPocName: "",
        interviewVenue: "",
        modeOfInterview: "",
        deliveryPocNumber: ""
      },
      massge: CONSTANTS.ERROR.EROOR,
      defaultDate: new Date()
    });
  };
  toEmail = event => {    
    if (event) {
      const data = [];
      event.map(e => {        
        data.push({ id: e.userid, email: e.value });        
      });
      this.setState(
        {
          fields: {
            ...this.state.fields,
            ...{ toEmails: data }
          }
        },
        () => {
          this.handleValidation("toEmails");
        }
      );
    }
  };
  closeSucess = () => {
    this.setState({
      sucessMsg: !this.state.sucessMsg
    });
  };
  render() {
    const { ccEmails, bccEmails, pdlEmails } = this.state;
    return (
      <div className="animated fadeIn">
        {this.state.sucessMsg && (
          <Module close={this.closeSucess} message={this.state.massge} />
        )}
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <strong>Schedule Interview</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="8" md={{ size: 12, offset: 2 }}>
                    <form
                      innerRef={this.formRef}
                      onSubmit={this.handleSubmit}
                      method="POST"
                    >
                      <Row>
                        <Col sm={{ size: 4 }}>
                          <FormGroup>
                            <Label htmlFor="name">
                              Client Name <span color="danger"> * </span>
                            </Label>
                            <Input
                              type="select"
                              name="cName"
                              id="cName"
                              onChange={this.handleChange}
                              invalid={this.state.invalid.cName}
                              value={this.state.fields.cName}
                            >
                              <option value="">Please select</option>
                              {this.state.clientName.map((value, key) => {
                                return (
                                  <option key={key} value={value.id}>
                                    {value.name}
                                  </option>
                                );
                              })}
                            </Input>
                            <FormFeedback invalid="true">
                              {this.state.errors.cName}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col sm={{ size: 4 }}>
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              Client Group Name 
                              {/*<span color="danger"> * </span>*/}
                            </Label>
                            <Input
                              type="select"
                              name="groupName"
                              id="groupName"
                              onChange={this.handleChange}
                              //invalid={this.state.invalid.groupName}
                              value={this.state.fields.groupName}
                            >
                              <option value="">Please select</option>
                              {this.state.clientGroup.map((value, key) => {
                                return (
                                  <option key={key} value={value.id}>
                                    {value.name}
                                  </option>
                                );
                              })}
                            </Input>
                            <FormFeedback invalid="true">
                              {this.state.errors.groupName}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              Interview Date And Time{" "}
                              <span color="danger"> * </span>
                            </Label>
                            {/* 
                            <DateTimePicker
                              className="dateTimePicker"
                              name="interviewDateTime"
                              id="interviewDateTime"
                              invalid={this.state.invalid.interviewDateTime}
                              defaultValue={new Date()}
                              min={new Date()}
                              onChange={e => {
                                this.DateTimeChange(e, "interviewDateTime");
                              }}
                            />
                          </FormGroup>
                        </Col> */}
                            <DateTimePicker
                              className={
                                !this.state.errors.interviewDateTime
                                  ? "dateTimePicker"
                                  : "dateTimePicker is-invalid"
                              }
                              name="interviewDateTime"
                              id="interviewDateTime"
                              invalid={this.state.invalid.interviewDateTime}
                              // defaultValue={this.state.defaultDate}
                              defaultValue={null}
                              value={this.state.defaultDate}
                              min={new Date()}
                              onChange={e => {
                                this.DateTimeChange(e, "interviewDateTime");
                              }}
                            />
                            {this.state.errors.interviewDateTime && (
                              <FormFeedback
                                invalid="true"
                                style={{ display: "block" }}
                              >
                                {this.state.errors.interviewDateTime}
                              </FormFeedback>
                            )}
                          </FormGroup>
                        </Col>

                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              Competency <span color="danger"> * </span>
                            </Label>
                            <Input
                              type="select"
                              name="skillCategory"
                              id="skillCategory"
                              onChange={this.handleChange}
                              invalid={this.state.invalid.skillCategory}
                              value={this.state.fields.skillCategory}
                            >
                              <option value="">Please select</option>
                              {this.state.skill.map((value, key) => {
                                return (
                                  <option key={key} value={value.id}>
                                    {value.skillName}
                                  </option>
                                );
                              })}
                            </Input>
                            <FormFeedback invalid="true">
                              {this.state.errors.skillCategory}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="4">
                          <FormGroup>
                            <Label htmlFor="name">
                              Interview Venue
                              {/* <span color="danger"> * </span> */}
                            </Label>
                            <Input
                              type="textarea"
                              name="interviewVenue"
                              id="interviewVenue"
                              rows="2"
                              placeholder="Interview Venue ..."
                              onChange={this.handleChange}
                              invalid={this.state.invalid.interviewVenue}
                              value={this.state.fields.interviewVenue}
                            />
                            <FormFeedback invalid="true">
                              {this.state.errors.interviewVenue}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              Mode of interview <span color="danger"> * </span>
                            </Label>
                            <Input
                              type="select"
                              name="modeOfInterview"
                              id="modeOfInterview"
                              onChange={this.handleChange}
                              value={this.state.fields.modeOfInterview}
                              invalid={this.state.invalid.modeOfInterview}
                            >
                              <option value="">Please select</option>
                              {this.state.modeOfInterview.map((value, key) => {
                                return (
                                  <option key={key} value={value}>
                                    {value}
                                  </option>
                                );
                              })}
                            </Input>
                            <FormFeedback invalid="true">
                              {this.state.errors.modeOfInterview}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="4">
                          <FormGroup>
                            <Label htmlFor="name">
                              Job Description <span color="danger"> * </span>
                            </Label>
                            <Input
                              type="textarea"
                              name="jobDescription"
                              id="jobDescription"
                              rows="3"
                              placeholder="Job Description..."
                              onChange={this.handleChange}
                              value={this.state.fields.jobDescription}
                              invalid={this.state.invalid.jobDescription}
                            />
                            <FormFeedback invalid="true">
                              {this.state.errors.jobDescription}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                            Additional information <span color="danger"> * </span>
                            </Label>
                            <Input
                              type="textarea"
                              name="comments"
                              id="comments "
                              rows="3"
                              placeholder="Additional information ..."
                              onChange={this.handleChange}
                              invalid={this.state.invalid.comments}
                              value={this.state.fields.comments}
                            />
                            <FormFeedback invalid="true">
                              {this.state.errors.comments}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              {" "}
                              Client POC Name <span color="danger"> * </span>
                            </Label>
                            <Input
                              type="text"
                              name="clientPocName"
                              id="textarea-input"
                              placeholder="Client POC Name..."
                              onChange={this.handleChange}
                              invalid={this.state.invalid.clientPocName}
                              value={this.state.fields.clientPocName}
                            />
                            <FormFeedback invalid="true">
                              {this.state.errors.clientPocName}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              Client POC Number
                              {/* <span color="danger"> * </span> */}
                            </Label>
                            <Input
                              onChange={this.handleChange}
                              type="text"
                              name="mobileNumber"
                              id="mobileNumber"
                              placeholder="Mobile Number..."
                              maxLength={12}
                              minLength={10}
                              value={this.state.fields.mobileNumber}
                            />
                            <FormFeedback invalid="true">
                              {this.state.errors.mobileNumber}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <Label htmlFor="ccnumber">
                            {" "}
                            Delivery POC Name {" "}
                            <span color="danger"> * </span>
                          </Label>
                          <Input
                            type="text"
                            name="deliveryPocName"
                            id="deliveryPocName"
                            placeholder="Delivery POC Name..."
                            onChange={this.handleChange}
                            invalid={this.state.invalid.deliveryPocName}
                            value={this.state.fields.deliveryPocName}
                          />
                          <FormFeedback invalid="true">
                            {this.state.errors.deliveryPocName}
                          </FormFeedback>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              Delivery POC Number
                              {/* <span color="danger"> * </span> */}
                            </Label>
                            <Input
                              onChange={this.handleChange}
                              type="text"
                              name="deliveryPocNumber"
                              id="deliveryPocNumber"
                              placeholder="Delivery POC Number..."
                              minLength={10}
                              maxLength={12}
                              value={this.state.fields.deliveryPocNumber}
                            />
                            <FormFeedback invalid="true">
                              {this.state.errors.deliveryPocNumber}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">
                              To <span color="danger"> * </span>
                            </Label>

                            <AsyncSelect
                              className={
                                this.state.invalid.toEmails && "toSelectError"
                              }
                              ref={input => this.selectInput = input}
                              isMulti
                              cacheOptions
                              loadOptions={this.promiseOptions}
                              onChange={this.toEmail}
                            />
                            {this.state.invalid.toEmails && (
                              <p className="errors toEmails">
                                {this.state.errors.toEmails}
                              </p>
                            )}
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <Label htmlFor="ccnumber">CC (Emails)</Label>
                          <FormGroup>
                            <ReactMultiEmail
                              placeholder="CC  (Emails)"
                              ccEmails={ccEmails}
                              value={this.state.fields.ccEmails}
                              onChange={(_ccEmails: string[]) => {
                                this.setState(
                                  {
                                    fields: {
                                      ...this.state.fields,
                                      ...{ ccEmails: _ccEmails }
                                    }
                                  },
                                  () => {
                                    this.handleValidation("ccEmails");
                                  }
                                );
                              }}
                              validateEmail={email => {
                                return isEmail(email); // return boolean
                              }}
                              getLabel={(
                                ccEmails: string,
                                index: number,
                                removeEmail: (index: number) => void
                              ) => {
                                return (
                                  <div data-tag key={index}>
                                    {ccEmails}
                                    <span
                                      data-tag-handle
                                      onClick={() => removeEmail(index)}
                                    >
                                      ×
                                    </span>
                                  </div>
                                );
                              }}
                            />
                            <FormFeedback invalid="true">
                              {this.state.invalid.ccEmails && (
                                <p className="errors">
                                  {this.state.errors.ccEmails}
                                </p>
                              )}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
                          <Label htmlFor="ccnumber">BCC (Emails)</Label>

                          <FormGroup>
                            <ReactMultiEmail
                              placeholder="BCC  (Emails)"
                              bccEmails={bccEmails}
                              onChange={(_bccEmails: string[]) => {
                                this.setState(
                                  {
                                    fields: {
                                      ...this.state.fields,
                                      ...{ bccEmails: _bccEmails }
                                    }
                                  },
                                  () => {
                                    this.handleValidation("bccEmails");
                                  }
                                );
                              }}
                              validateEmail={email => {
                                return isEmail(email); // return boolean
                              }}
                              getLabel={(
                                bccEmails: string,
                                index: number,
                                removeEmail: (index: number) => void
                              ) => {
                                return (
                                  <div data-tag key={index}>
                                    {bccEmails}
                                    <span
                                      data-tag-handle
                                      onClick={() => removeEmail(index)}
                                    >
                                      ×
                                    </span>
                                  </div>
                                );
                              }}
                            />
                            <FormFeedback invalid="true">
                              {this.state.invalid.bccEmails && (
                                <p className="errors">
                                  {this.state.errors.bccEmails}
                                </p>
                              )}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="ccnumber">PDL's To (Emails)</Label>

                            <ReactMultiEmail
                              placeholder="PDL's To (Emails)"
                              pdlEmails={pdlEmails}
                              onChange={(_pdlEmails: string[]) => {
                                this.setState(
                                  {
                                    fields: {
                                      ...this.state.fields,
                                      ...{ pdlEmails: _pdlEmails }
                                    }
                                  },
                                  () => {
                                    this.handleValidation("pdlEmails");
                                  }
                                );
                              }}
                              validateEmail={email => {
                                return isEmail(email); // return boolean
                              }}
                              getLabel={(
                                pdlEmails: string,
                                index: number,
                                removeEmail: (index: number) => void
                              ) => {
                                return (
                                  <div data-tag key={index}>
                                    {pdlEmails}
                                    <span
                                      data-tag-handle
                                      onClick={() => removeEmail(index)}
                                    >
                                      ×
                                    </span>
                                  </div>
                                );
                              }}
                            />
                            <FormFeedback invalid="true">
                              {this.state.invalid.pdlEmails && (
                                <p className="errors">
                                  {this.state.errors.pdlEmails}
                                </p>
                              )}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs="4">
                          <FormGroup>
                            <Label htmlFor="rrfid">
                              RRFID<span color="danger"> * </span>
                            </Label>
                            <Input
                              type="text"
                              name="rrfid"
                              id="rrfid "
                              rows="3"
                              placeholder="Enter RRFID"
                              onChange={this.handleChange}
                              invalid={this.state.invalid.rrfid}
                              value={this.state.fields.rrfid}
                            />
                            <FormFeedback invalid="true">
                              {this.state.errors.rrfid && (
                                <p className="errors toEmails">
                                  {this.state.errors.rrfid}
                                </p>
                              )}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        {/* <Col sm={{ size: 6 }}> */}
                        <Col md={{ size: 12, offset: 3 }}>
                          <Button className="btn-schedule" color="success">
                            Submit
                          </Button>
                          <Button
                            className="btn-schedule"
                            onClick={this.formReset}
                            color="warning"
                          >
                            Reset
                          </Button>
                        </Col>
                      </Row>
                    </form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export const mapStateToProps = state => {
  return {
    userSession: state.session.user
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Tables);
