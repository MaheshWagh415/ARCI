import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {Button} from 'react-bootstrap';
import { ActionCreators } from "../../../redux/actions";
import axios from 'axios';
import * as constants from '../../../constants'

class UpdateSkillModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      open: true,
      skills : [],
      skillId : 0,
      tokenType : '',
      accessToken : '',
      skillName : ''
    };
    this.onchange = this.onchange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  onClickUpdate(){
  const skills = this.state.skills;
  const Id = this.state.skillId;
  const competency = this.state.skillName;
  const message = this.state.message;
  const skill = {
    id : Id,
    skillName : competency
  }
  this.setState({
        message : ''
      })
  const skillReq = skills.filter(skill => skill.skillName.toUpperCase() === competency.toUpperCase());  
  if( competency.trim() !== ''){
  const url = constants.BASE_URL+`/admin/skills/`+Id;
        axios.put(url, skill, {
          headers: {
            Authorization: this.state.tokenType + " " + this.state.accessToken
          }
        })
            .then((res => { 
              const skill = res.data;
              this.setState({
                skills,
                message : ''
            })
            this.componentDidMount();
            this.closeModal();
            this.props.notifyAlert("Competency Updated Successfully!");
          }))
            .catch((err) => {
              console.log("Error : "+err);
              this.setState({
                message : "Competency is already exists!"
              })
            })
        }
      else {
        this.setState({
          message : "Competency can't be empty!"
        })
      }
    }

  componentDidMount() {
        let { accessToken, tokenType } = this.props.userSession;
        const skillData = this.props.updateSkill;
        this.setState({
      accessToken: accessToken,
      tokenType: tokenType,
      skillId : skillData.id,
      skillName : skillData.skillName
        });
        let data = { accessToken, tokenType };
        this.props.skillAction(data)
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

  closeModal = () => {
    this.setState({
      open: !this.state.open
    });
    this.props.close();
  };

  onchange = (e) => {
    let skillName = this.state.skillName;
    this.setState({
        skillName : e.target.value
    })
  }

  render() {
    let { open } = this.state;
    const message = this.state.message;
    if(this.state.open === false){
       return <Redirect to='/admin/skills' />
    }
    return (
      <div className="app flex-row align-items-center">
    <Modal isOpen={open} toggle={this.closeModal}>
          <ModalHeader>Update Competency</ModalHeader>
          <ModalBody><FormGroup>
            <Label htmlFor="name">Competency Name :<span color="danger"> * </span></Label>
            <Input
            type="text"
            name="skillName"
            value={this.state.skillName}
            placeholder="Update Competency"
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
    skills: state.adminReducer.skills
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(UpdateSkillModal);


