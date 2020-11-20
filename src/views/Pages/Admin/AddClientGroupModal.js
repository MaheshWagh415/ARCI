import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup,InputGroup,InputGroupAddon, InputGroupText, Label, Input, FormFeedback } from "reactstrap";
import {Button} from 'react-bootstrap';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as constants from '../../../constants'
class AddClientGroupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      clientName : '',
      clients : [],
      tokenType : '',
      accessToken : '',
      dropDownValue: 'Select Client Name',
      clientId: '',
      message : ''
    };
    this.onchange = this.onchange.bind(this);
    this.addModal = this.addModal.bind(this);
    this.addModal = this.addModal.bind(this);
    this.notify = this.notify.bind(this);
  }

  componentDidMount() {
        let { accessToken, tokenType } = this.props.userSession;
        this.setState({
      accessToken: accessToken,
      tokenType: tokenType
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
  notify = (successMsg) =>  toast.success(successMsg, {hideProgressBar: true});
  notifyError = (errorMsg) =>  toast.error(errorMsg, {hideProgressBar: true});
  addModal() {
      const clients = this.state.clients;
      const clntName = this.state.clientName;
      const message = this.state.message;
      const clientReq = clients.filter(client => client.clientName.toUpperCase() === clntName.toUpperCase());
      
      this.setState({
        message : ''
      })
      const client = {
        clientId : this.state.clientId,
        groupName:this.state.groupName
      }
      let successMsg ='';
      let errorMsg ='';
      //console.log("++++" +client.clientId+" +++"+client.groupName)
     // if( clntName.trim() !== ''){
        //if(clientReq.length === 0 ){
            const url = constants.BASE_URL+`/admin/clientGroup`;
        axios.post(url, client, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
            .then((res => { 
              if (res.status === 201) {
              const client = res.data;
              successMsg = "Client Group Added Successfully!";
              //console.log(res.data.body.message)
              clients.push(client);
              this.setState( {
                clients,
                message : ''
            })
            this.componentDidMount();
            this.notify(successMsg);
          }
          else
          { 
            errorMsg = res.data.body.message;
            this.notifyError(errorMsg);
          }
          }))
            .catch((err) => {
              console.log(err)
                alert("Error : "+ err);
            })
            this.closeModal();
        // }
        // else {
        //   this.setState({
        //   message : "Client already exists."
        // })
        // }
      //  }
      //  else {
      //    this.setState({
      //      message : "Client Group Name can't be empty."
      //    })
      //  }
  }

  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.close();
  };

  onchange(e){
    const groupName = this.state.groupName;
    this.setState({
      groupName : e.target.value
    })
  }
  
  render() {
    let { open } = this.state;
    let message = this.state.message;
    if(this.state.open === false){
      return (<Redirect to="/admin/clientGroup" />)
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
    <ModalHeader>Add Client Group</ModalHeader>
          <ModalBody>
            <FormGroup>
            <p className="text-muted label-updateUser">Clients :<span color="danger"> * </span> </p>
            <Input
                          type="select"
                          id="client"
                          value={this.state.clientId} onChange={(event) => {
                            this.setState({
                              clientId: event.target.value,
                              invalidClient: false
                            })
                          }}
                        >
                          <option value="">  {this.state.dropDownValue}</option>
                          {
                            this.state.clients && this.state.clients.map((data) => {
                              return (
                                <option value={data.id}>{data.clientName}</option>
                              )
                            })
                          }
                        </Input>
            <Label htmlFor="name">Client Group Name :<span color="danger"> * </span></Label>
            <Input
            type="text"
            name="groupName"
            value={this.state.groupName}
            placeholder="Enter Client Group Name"
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
)(AddClientGroupModal);
