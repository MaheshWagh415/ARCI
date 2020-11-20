import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import {Button} from 'react-bootstrap';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import axios from 'axios';
import * as constants from '../../../constants'
class AddClientModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      clientName : '',
      clients : [],
      tokenType : '',
      accessToken : '',
      message : ''
    };
    this.onchange = this.onchange.bind(this);
    this.addModal = this.addModal.bind(this);
    this.addModal = this.addModal.bind(this);
  }

  componentDidMount() {
        let { accessToken, tokenType } = this.props.userSession;
        this.setState({
      accessToken: accessToken,
      tokenType: tokenType
        });
        let data = { accessToken, tokenType };
        this.props.clientAction(data)
        this.componentDidUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.clients && this.props.clients.status) {
      let { data, status } = this.props.clients;
      if (prevProps != this.props && status === 200) {
        let tempData = [];
        data.map((data, index) => {
          tempData.push({ ...data, index: ++index });
        });
        this.setState(
          {
            clients: tempData
          });
      }
    }
  }

  addModal() {
      const clients = this.state.clients;
      const clntName = this.state.clientName;
      const message = this.state.message;
      const clientReq = clients.filter(client => client.clientName.toUpperCase() === clntName.toUpperCase());
      this.setState({
        message : ''
      })
      const client = {
        clientName : clntName
      }
      if( clntName.trim() !== ''){
        if(clientReq.length === 0 ){
            const url = constants.BASE_URL+`/admin/client`;
        axios.post(url, client, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
            .then((res => { 
              const client = res.data;
              clients.push(client);
              this.setState( {
                clients,
                message : ''
            })
            this.componentDidMount();
          }))
            .catch((err) => {
                alert("Error : "+ err);
            })
            this.props.notifyAlert("Client Added Successfully!");
            this.closeModal();
        }
        else {
          this.setState({
          message : "Client already exists."
        })
        }
      }
      else {
        this.setState({
          message : "Client can't be empty."
        })
      }
  }

  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.close();
  };

  onchange(e){
    const clientName = this.state.clientName;
    this.setState({
        clientName : e.target.value
    })
  }

  render() {
    let { open } = this.state;
    let message = this.state.message;
    if(this.state.open === false){
      return (<Redirect to="/admin/clients" />)
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Add Client</ModalHeader>
          <ModalBody>
            <FormGroup>
            <Label htmlFor="name">Client Name :<span color="danger"> * </span></Label>
            <Input
            type="text"
            name="clientName"
            value={this.state.clientName}
            placeholder="Enter Client Name"
            onChange={this.onchange}
            />
            </FormGroup>
            <p className="alert-danger">{message}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="success" onClick={this.addModal}>
              Add
            </Button>
            <Button variant="danger" onClick={this.closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    userSession: state.session.user,
    clients: state.adminReducer.clients
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(AddClientModal);
