import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {Label,FormGroup,
  Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup,
   InputGroupAddon, InputGroupText, Row, FormFeedback, Dropdown, DropdownMenu, DropdownToggle, DropdownItem
 }
   from 'reactstrap';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {Button} from 'react-bootstrap';
import { ActionCreators } from "../../../redux/actions";
import axios from 'axios';
import * as constants from '../../../constants'

class UpdateClientGroupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: true,
      clientGroups : [],
      clientId : 0,
      tokenType : '',
      accessToken : '',
      clientName : '',
      clientGroupName : ''
    };
    this.onchange = this.onchange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  onClickUpdate(){
    const clients = this.state.clients;
    const message = this.state.message;
    const clientGroupName = this.state.clientGroupName;
    const clientId = this.props.updateClient.id;
    const clientGroupId = this.props.updateClient.clientGroupId;
    const clientGroup = {
      groupName : clientGroupName,
      id : clientId
    }
      if(clientGroupName.trim()!==''){
      const url = constants.BASE_URL+`/admin/clientGroup/`+clientGroupId;
      axios.put(url, clientGroup, {
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
          this.props.notifyAlert("Client Group Updated Successfully!");
          this.closeModal();        
        }))
          .catch((err) => {
              console.log("Error : "+err);
          })
      }else {
        this.setState({
          message : "Client Group Name can't be empty!"
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
          clientName : clientData.clientName,
          clientGroupName : clientData.clientGroupName,
          clientGroupId:clientData.clientGroupId,
          dropDownValue:clientData.clientName,
        });
        let data = { accessToken, tokenType };
        this.props.clientAction(data);
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
    var clientGroupName = this.state.clientGroupName;
    this.setState({
      clientGroupName : e.target.value
    })
  }

  render() {
    let { open } = this.state;
    const message = this.state.message;
    if(this.state.open === false){
       return <Redirect to='/admin/clientGroups' />
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Update Client Group</ModalHeader>
          <ModalBody><FormGroup>
          <p className="text-muted label-updateUser">Clients</p>
                      <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                          <Input
                          type="select"
                          id="clients"
                          value={this.state.clientId} onChange={(event) => {
                            this.setState({
                              clientId: event.target.value,
                              invalidClient: false
                            })
                          }}
                          disabled >
                          <option value="">  {this.state.dropDownValue}</option>
                          {
                            this.state.clients && this.state.clients.map((data) => {
                              return (
                                <option value={data.id}>{data.clientName}</option>
                              )
                            })
                          }


                        </Input>
                        </InputGroup>
            <Label htmlFor="name">Client Group Name :<span color="danger"> * </span></Label>
            <Input
            type="text"
            name="clientGroupName"
            value={this.state.clientGroupName}
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
)(UpdateClientGroupModal);


