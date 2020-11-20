import React, { Component, Fragment } from "react";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";
export default class Success extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active ? true : false,
      msg: this.props.active
    };
  }
  closeModal = () => {
    this.setState({
      active: false
    });
    this.props.closeModal();
  };
  render() {
    let { active, msg } = this.state;
    return (
      <Fragment>
        <Modal isOpen={active} toggle={this.closeModal}>
          <ModalHeader>
            Interview Feedback
            <a className="close_arrow" onClick={this.closeModal}>
              X
            </a>
          </ModalHeader>
          <ModalBody>
            <div align="center">{msg}</div>
            <br />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}
