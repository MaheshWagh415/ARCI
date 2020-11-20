import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      redirect:false
    };
  }
  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    if(this.props.status===201){
      this.setState({
        redirect:true
      });
    }
    else{
      this.setState({redirect: false});
    } 
    if(this.props.redirectToLogin)
      this.props.closePopUp();
  };
  render() {
    let  open  = this.state.open;
    const message = this.props.message;
    if(this.state.redirect){
       return <Redirect to='/login' />
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} >
          <ModalHeader>Registration</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeModal}>
              Go To Login
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
  componentWillUnmount() {  
    console.log("popup component will unmount");   

  }
}

export default Popup;
