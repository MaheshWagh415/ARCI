import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import axios from "axios";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionCreators } from "../../redux/actions";
import * as baseConstants from "../../constants";

class AssociateFeedback extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      accessToken: "",
      tokenType: "",
      questions: []
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }
  close = () => {
    this.setState({
      modal: false
    })
  }
  componentDidMount() {

    let { accessToken, tokenType } = this.props.userSession;
    this.setState({
      accessToken: accessToken,
      tokenType: tokenType
    }, () => {



      let url = baseConstants.BASE_URL + "/interviews/feedback/" + this.props.feedbackid;
      axios
        .get(url, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
        .then(res => {
          console.log(res.data);
          this.setState({
            questions: res.data.questions
          })
        })
        .catch(error => {
          console.log("error ==>", error);
        });
    });

  }
  render() {
    let { questions } = this.state;

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
          value: questions && questions.length
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
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
    };
    return (
      <div>

        <a href="javascript:void(0);" onClick={this.toggle}>{this.props.buttonLabel}</a>
        {/* <Button color="info" style={{ padding: "2%", marginLeft: "2%", zIndex: "999" }} onClick={this.toggle}>{this.props.buttonLabel}</Button> */}
        <Modal style={{ maxWidth: "60%" }} isOpen={this.state.modal}>
          <ModalHeader>Interview Feedback by Associate</ModalHeader>
          <ModalBody className="scroll-vertical-fb">

            {questions && (
              <BootstrapTable ref='table' search={true} data={questions} options={options} pagination exportCSV={true}>
                <TableHeaderColumn dataField='id' width={'8%'} dataAlign='center' isKey={true}>Sr No.</TableHeaderColumn>
                <TableHeaderColumn dataField='text' dataAlign='left'  >Question</TableHeaderColumn>

              </BootstrapTable>
            )}

            {/* <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Sr. No. </th>
                    <th>Question</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    this.state.questions && this.state.questions.map((data, index) => {
                      return (
                        <tr>
                          <td>{data.id}</td>
                          <td>{data.text}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table> */}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.close}>Cancel</Button>{' '}
          </ModalFooter>
        </Modal>

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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssociateFeedback);
