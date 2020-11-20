import React, { Component } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Form, Label, Input, FormFeedback
} from 'reactstrap';
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionCreators } from "../../redux/actions";
import * as baseConstants from "../../constants";
import Moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ClientFeedbackModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            accessToken: "",
            tokenType: "",
            statudata: [],
            status: "",
            feedback: "",

            invalidStatus: false,
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    clearForm = () => {
        this.setState({
            modal: !this.state.modal,
            invalidStatus: false,
            feedback: "",
            status: ""
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



            let url = baseConstants.BASE_URL + "/status/all";
            axios
                .get(url, {
                    headers: {
                        Authorization: this.state.tokenType + " " + this.state.accessToken
                    }
                })
                .then(res => {
                    console.log(res.data);
                    this.setState({
                        statudata: res.data
                    })
                })
                .catch(error => {
                    console.log("error ==>", error);
                });
        });

    }

    submitFeedback = (event) => {
        event.preventDefault();

        if (this.state.status === "") {
            this.setState({
                invalidStatus: true
            });
        } else {

            let { accessToken, tokenType } = this.props.userSession;
            let url =
                baseConstants.BASE_URL + "/interviews/client/feedback"

            const data = {
                comment: this.state.feedback,
                interviewId: this.props.data.id,
                statusId: this.state.status
            }

            this.props.spinnerAction(true);
            axios
                .put(url, data, {
                    headers: { "Authorization": tokenType + " " + accessToken },
                })
                .then(success => {

                    this.clearForm();
                    this.props.pastState.getPastData();
                    this.props.spinnerAction(false);
                    toast.success("Feedback Recorded Successfully!");
                    console.log(success);
                })
                .catch(error => {
                    toast.error("Something went wrong, Please try again!");
                    // let apiError = error.response.data;
                    console.log(error);
                });

        }







    }

    render() {
        return (
            <div >
                <a href="javascript:void(0);" onClick={this.toggle}>Submit</a>
                {/* <Button color="info" style={{ padding: "2%" }} onClick={this.toggle}>Submit </Button> */}
                <Modal isOpen={this.state.modal}  >
                    <Form onSubmit={this.submitFeedback}>
                        <ModalHeader >Client Feedback</ModalHeader>
                        <ModalBody>

                            <Row>

                                <Col md={4}>
                                    <Label className="font-weight-bold" >Associate Name :</Label>
                                </Col>
                                <Col >
                                    {this.props.data.associateName}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Label className="font-weight-bold" >Client Group :</Label>
                                </Col>

                                <Col>
                                    {this.props.data.clientGroup}
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Label className="font-weight-bold">Interview Date :</Label>
                                </Col>

                                <Col >
                                    {Moment(this.props.data.interviewDate).format("DD/MM/YYYY")}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Label className="font-weight-bold">Client :</Label>
                                </Col>
                                <Col>
                                    {this.props.data.client}
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Label className="font-weight-bold">Skill :</Label>
                                </Col>
                                <Col >
                                    {(this.props.data.skill) && this.props.data.skill.skillName}
                                </Col>
                            </Row>

                            <Row>

                                <Col md="4">

                                    <Label className="font-weight-bold" >Status :</Label>
                                </Col>

                                <Col md="5">
                                    <Input invalid={this.state.invalidStatus}
                                        type="select"
                                        id="status"
                                        value={this.state.status} onChange={(event) => {
                                            this.setState({
                                                status: event.target.value,
                                                invalidStatus: false
                                            })
                                        }}
                                    >
                                        <option value="">Please select</option>
                                        {
                                            this.state.statudata && this.state.statudata.map((data) => {
                                                return (
                                                    <option value={data.id}>{data.statusName}</option>
                                                )
                                            })
                                        }


                                    </Input>
                                    <FormFeedback invalid="true">Please select valid status</FormFeedback>

                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12">
                                    <Label className="font-weight-bold">Client Feedback :</Label>
                                    <Input
                                        type="textarea"
                                        name="clientFeedback"
                                        rows="3"
                                        placeholder="Client Feedback..."

                                        value={this.state.feedback} onChange={(event) => {
                                            this.setState({
                                                feedback: event.target.value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>



                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" >Submit</Button>{' '}
                            <Button color="secondary" onClick={this.clearForm}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div >

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
)(ClientFeedbackModal);
