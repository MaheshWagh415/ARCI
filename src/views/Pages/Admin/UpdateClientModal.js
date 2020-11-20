import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {Button} from 'react-bootstrap';
import { ActionCreators } from "../../../redux/actions";
import axios from 'axios';
import * as constants from '../../../constants'

class UpdateClientModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: true,
      clients : [],
      clientId : 0,
      tokenType : '',
      accessToken : '',
      clientName : ''
    };
    this.onchange = this.onchange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  onClickUpdate(){
  const clients = this.state.clients;
  const Id = this.state.clientId;
  const clntName = this.state.clientName;
  const message = this.state.message;
  const client = {
    id : Id,
    clientName : clntName
  }
  this.setState({
        message : ''
      })
  const clientReq = clients.filter(client => client.clientName.toUpperCase() === clntName.toUpperCase());  
  if( clntName.trim() !== ''){
  const url = constants.BASE_URL+`/admin/client/`+Id;
        axios.put(url, client, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
            .then((res => { 
              const client = res.data;
              this.setState({
                clients,
                message : ''
            })
            this.componentDidMount();
            this.closeModal();
            this.props.notifyAlert("Client Updated Successfully!");
          }))
            .catch((err) => {
              console.log("Error : "+err);
              this.setState({
                message : "Client already exists!"
              })
            })
        }
      else {
        this.setState({
          message : "Client can't be empty!"
        })
      }
    }

  componentDidMount() {
        let { accessToken, tokenType } = this.props.userSession;
        const clientData = this.props.updateClient;
        this.setState({
          accessToken: accessToken,
          tokenType: tokenType,
          clientId : clientData.id,
          clientName : clientData.clientName
        });
        let data = { accessToken, tokenType };
        this.props.clientAction(data)
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

  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.close();
  };

  onchange = (e) => {
    let clientName = this.state.clientName;
    this.setState({
        clientName : e.target.value
    })
  }

  render() {
    let { open } = this.state;
    const message = this.state.message;
    if(this.state.open === false){
       return <Redirect to='/admin/clients' />
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Update Client</ModalHeader>
          <ModalBody><FormGroup>
            <Label htmlFor="name">Client Name :<span color="danger"> * </span></Label>
            <Input
            type="text"
            name="clientName"
            value={this.state.clientName}
            placeholder="Update Client"
            onChange={this.onchange}
            />
            </FormGroup>
            <p className="alert-danger">{message}</p></ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={this.onClickUpdate}>
              Update
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
)(UpdateClientModal);


