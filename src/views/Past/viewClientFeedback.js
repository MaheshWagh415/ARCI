import React, { Component } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Form, Label, Card, CardBody
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



    close = () => {
        this.setState({
            modal: false
        })
    }






    render() {
        return (
            <div >
                <a href="javascript:void(0);" onClick={this.toggle}>View</a>
                {/* <Button color="info" style={{ padding: "2%" }} onClick={this.toggle}>View </Button> */}
                <Modal isOpen={this.state.modal} >
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
                                <Label className="font-weight-bold">Client Group :</Label>
                            </Col>

                            <Col >
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
                            <Col >
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
                            <Col md={4}>
                                <Label className="font-weight-bold">Status :</Label>
                            </Col>
                            <Col >
                                {(this.props.data.interviewStatus[0]) && this.props.data.interviewStatus[0].status}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label className="font-weight-bold">Client Feedback :</Label>
                                <Card className="scroll-vertical">
                                    <CardBody>
                                        {this.props.data.clientFeedback}
                                    </CardBody>
                                </Card>

                            </Col>
                        </Row>


                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
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
