import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {Button} from 'react-bootstrap';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import axios from 'axios';

class DeleteSkillModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: true,
      skills : [],
      skillId : 0,
      tokenType : '',
      accessToken : '',
      skillData : {}
    };
    this.onClickDelete = this.onClickDelete.bind(this);
  }

componentDidMount() {
        let { accessToken, tokenType } = this.props.userSession;
        const skillData = this.props.skillData;
        this.setState({
      accessToken: accessToken,
      tokenType: tokenType,
      skillData
        });
        let data = { accessToken, tokenType };
        this.props.skillAction(data)
        this.componentDidUpdate();
      }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.skills && this.props.skills.status) {
      let { data, status } = this.props.skills;
      if (prevProps != this.props && status === 200) {
        let tempData = [];
        data.map((data, index) => {
          tempData.push({ ...data, index: ++index });
        });
        this.setState(
          {
            skills: tempData
          });
      }
    }
  }

  onClickDelete(){
   const skillData = this.state.skillData;
   const skills = this.state.skills.filter(skill => skill.id !== skillData.id);
   const skillId = skillData.id;
   const message = this.state.message;
    this.setState({
     message : ''
    })
        const url = `http://localhost:8080/admin/skills/`+skillId;
        axios.delete(url, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
            .then(res => {
              if(res.status === 200){
              this.setState({
                skills,
                message : ''
            })
            this.closeModal();
            this.props.notifyAlert("Competency Deleted Successfully!");
            this.componentDidMount();
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
    const skillData = this.props.skillData;
    if(this.state.open === false){
       return <Redirect to='/admin/skills' />
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Competency Confirmation</ModalHeader>
          <ModalBody><strong>Do you want to delete competency : {skillData.skillName} ?</strong><br />
          <strong><sub>Note : Allocated competency can't be deleted.</sub></strong><br /><br />
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
    skills: state.adminReducer.skills
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(DeleteSkillModal);
