import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: true
    };
  }
  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    
  };
  render() {
    let { open } = this.state;
    const message = this.props.message;
    if(this.state.open === false){
       return <Redirect to='/login' />
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  componentWillUnmount() {  
    this.setState({
      open: true
    })
  }
}

export default Popup;
