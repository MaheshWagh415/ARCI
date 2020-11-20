import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Label,
  Form
} from "reactstrap";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { bindActionCreators } from "redux";
import * as baseConstants from "../../constants";
import axios from "axios";
import AsyncSelect from "react-select/async";
import SearchItem from "../Search/SearchItem";

class Tables extends Component {
  state = { inputValue: "" };
  constructor() {
    super();
    this.state = {
      searchData: {},
      searchList: {},
      accessToken: "",
      tokenType: "",
      email: "",
      inputValue: "",
      autosuggestRecords: []
    };
  }

  componentDidMount() {    
    if(localStorage.getItem("associateId")) {
      let obj = {
        value: {
          userId: localStorage.getItem("associateId"),      
          email: null
      }, label: null}
      this.toEmail(obj);
      localStorage.removeItem('associateId');
    } 
                         
    let { accessToken, tokenType } = this.props.userSession;
    this.setState({
      accessToken: accessToken,
      tokenType: tokenType
    });
  }
  promiseOptions = inputValue =>
    new Promise(resolve => {
      let url = baseConstants.BASE_URL + "/api/users/search/" + inputValue;
      let finalData = [];
      axios
        .get(url, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
        .then(res => {
          finalData = res.data;
          let tempData;
          if (finalData) {
            tempData = [];
            res.data.map((d, i) => {
              if (i < 5) {
                tempData.push({
                  value: d,
                  label: " <" + d.firstName + " " + d.lastName + "> " + d.email
                });
              }
            });
          }
          this.setState(
            {
              searchList: finalData,
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

  toEmail = event => {
    this.setState({
      searchData: {}
    });

    if (event) {
      let data = 0;
      // console.log(event.value)
      data = event.value.userId;
      // event.map(e => {
      //   console.log(e.value.userId)
      //   data.push(e.value.userId);
      // });
      const searchId = data;
      this.setState({
        searchData: data,
        email: event.value.email
      });
    }
  };

  filterColors = (inputValue) => {
    let { autosuggestRecords } = this.state;    
    if (autosuggestRecords && autosuggestRecords[0] != undefined) {
      return autosuggestRecords.filter(i =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } else {      
      return [{
        label: "No Record Found.",
        value: "No Record Found."
      }];
    }
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="input-group">
                      <Col md="6">
                        <Form inline>
                          <FormGroup>
                            <Label htmlFor="ccnumber" className="labelStyle">
                              <strong>Search Associate : </strong>
                            </Label>
                            <AsyncSelect
                              cacheOptions
                              loadOptions={this.promiseOptions}
                              onChange={this.toEmail}
                              value={this.state.email}
                            />
                          </FormGroup>
                        </Form>
                      </Col>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <SearchItem
                  id={this.state.searchData}
                  tokenType={this.state.tokenType}
                  accessToken={this.state.accessToken}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
