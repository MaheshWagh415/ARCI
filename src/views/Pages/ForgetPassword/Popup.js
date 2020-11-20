import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class Popup extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      message: "",
      status: this.props.status,
      open: true
    };
  }
  closeModal = () => {
    this.setState({
      open: false,
      message: null
    });    
    this.props.close();
  };
  render() {
    let { open, status } = this.state;
    const message = this.props.message;         
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeModal}>
              OK
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }  
}

export default Popup;
