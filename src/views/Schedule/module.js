import React, { Component } from 'react'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default class Module extends Component {
    constructor(props) {
        super(props);
        this.state = {
          message: this.props.message,
          open: true
        };
      }
      closeModal = () => {
        // this.setState({
        //   open: !this.state.open
        // });
        this.props.close();
      };
    render() {
        let { message, open } = this.state;
        return (
            <div className="app flex-row align-items-center">
                <Modal isOpen={open} toggle={this.closeModal}>
              <ModalHeader>Schedule Interview</ModalHeader>
              <ModalBody>{message} </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.closeModal}>
                  Ok
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        )
    }
}
