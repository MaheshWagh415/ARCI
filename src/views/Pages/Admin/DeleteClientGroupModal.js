import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {Button} from 'react-bootstrap';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import axios from 'axios';
import * as constants from '../../../constants'

class DeleteClientGroupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: true,
      clients : [],
      clientId : 0,
      tokenType : '',
      accessToken : '',
      clientData : {}
    };
    this.onClickDelete = this.onClickDelete.bind(this);
  }

componentDidMount() {
  console.log(this.props.clientData);
        let { accessToken, tokenType } = this.props.userSession;
        const clientData = this.props.clientData;
        this.setState({
      accessToken: accessToken,
      tokenType: tokenType,
      clientGroupId:clientData.clientGroupId,
      clientData
        });
        let data = { accessToken, tokenType };
        this.props.clientAction(data)
        //this.componentDidUpdate();
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

  onClickDelete(){
   const clientData = this.state.clientData;
   const clients = this.state.clients.filter(client => client.id !== clientData.id);
   const clientId = clientData.id;
   const message = this.state.message;
    this.setState({
     message : ''
    })
        const url = constants.BASE_URL+`/admin/clientGroup/`+this.state.clientGroupId;
        axios.delete(url, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
            .then(res => {
              if(res.status === 200){
              this.setState({
                clients,
                message : ''
            })
            this.componentDidMount();
            this.props.notifyAlert("Client Group Deleted Successfully!");
            this.closeModal();
            
        }})
            .catch((err) => {
              this.setState({
                message : 'Competency has already assigned to multiple associates!'
              })
             })    
          }

  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.close();
  };
  
  render() {
    let { open } = this.state;
    const message = this.state.message;
    const clientData = this.props.clientData;
    if(this.state.open === false){
       return <Redirect to='/admin/clientGroups' />
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Client Group Confirmation</ModalHeader>
          <ModalBody><strong>Do you want to delete Client Group: {clientData.clientGroupName} ?</strong><br />
          <p className="alert-danger">{message}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="danger" onClick={this.onClickDelete}>
              Delete
            </Button>
            <Button variant="info" onClick={this.closeModal}>
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
)(DeleteClientGroupModal);
