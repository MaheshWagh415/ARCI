import React, { Component } from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";

class Page500 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.message,
      open: true
    };
  }
  closeModal = () => {
    this.props.errorResetAction();
    this.setState({
      open: !this.state.open
    });
  };
  render() {
    let { message, open } = this.state;
    return (
      <div className="app flex-row align-items-center">
        {/* <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <span className="clearfix">
                <h1 className="float-left display-3 mr-4">500</h1>
                <h4 className="pt-3">Houston, we have a problem!</h4>
                <p className="text-muted float-left">
                  {message}
                </p>
              </span>
              <InputGroup className="input-prepend">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-search"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  size="16"
                  type="text"
                  placeholder="What are you looking for?"
                />
                <InputGroupAddon addonType="append">
                  <Button color="info">Search</Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Container> */}

        <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Server Error</ModalHeader>
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
}

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(
  null,
  mapDispatchToProps
)(Page500);
