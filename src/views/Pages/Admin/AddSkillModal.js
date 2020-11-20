import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import {Button} from 'react-bootstrap';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import axios from 'axios';
import * as constants from '../../../constants';

class AddSkillModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      skillName : '',
      skills : [],
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

  addModal() {
      const skills = this.state.skills;
      const competency = this.state.skillName;
      const message = this.state.message;
      const skillReq = skills.filter(skill => skill.skillName.toUpperCase() === competency.toUpperCase());
      this.setState({
        message : ''
      })
      const skill = {
        skillName : competency
      }
      if( competency.trim() !== ''){
        if(skillReq.length === 0 ){
            const url = constants.BASE_URL+`/admin/skills`;
        axios.post(url, skill, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
            .then((res => { 
              const skill = res.data;
              skills.push(skill);
              this.setState( {
                skills,
                message : ''
            })
            this.componentDidMount();
          }))
            .catch((err) => {
                alert("Error : "+ err);
            })
            this.props.notifyAlert("Competency Added Successfully!");
            this.closeModal();
        }
        else {
          this.setState({
          message : "Competency is already exists."
        })
        }
      }
      else {
        this.setState({
          message : "Competency can't be empty."
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
    const skillName = this.state.skillName;
    this.setState({
        skillName : e.target.value
    })
  }

  render() {
    let { open } = this.state;
    let message = this.state.message;
    if(this.state.open === false){
      return (<Redirect to="/admin/skills" />)
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Add Competency</ModalHeader>
          <ModalBody>
            <FormGroup>
            <Label htmlFor="name">Competency Name :<span color="danger"> * </span></Label>
            <Input
            type="text"
            name="skillName"
            value={this.state.skillName}
            placeholder="Enter Competency"
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
    skills: state.adminReducer.skills
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(AddSkillModal);
