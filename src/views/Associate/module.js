import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { Table } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
class Module extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      skills: this.props.UserSkills,   
      id: this.props.interviewId,
      session: this.props.token,    
      input: null,
      mySkills: null,
      activeTab: 0,
      setActiveTab: 0,
      Obj: [],
      questionList: [],
      singleQue: null,
      currentSkills: null,
      interviewId: this.props.interviewId
    };
  }
  closeModal = () => {
    this.setState({
      active: false
    });
    this.props.closeModal();
  };
  submitClicked = () => {
    let { session, mySkills, interviewId } = this.state;
    let { accessToken, tokenType } = session;
    let questions = [];
    try {
      if (mySkills) {
        mySkills.map(data => {
          let skill = data.skillName;
          let skillId = data.id;
          let list = [];
          this.state[skill].map(data => {
            list.push(data.question);
          });
          let obj = { skillId, questions: list };
          questions.push(obj);
        });
        let data = {
          accessToken,
          tokenType,
          interviewId,
          questions
        };
        this.closeModal();
        this.props.spinnerAction(true);        
        this.props.addInterviewQueAction(data);
      } else {
        alert("Please Add Questions as per Skills.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  addElement = (label, e) => {
    let { singleQue } = this.state;
    let question = e.target.value;
    let data = {
      skill: label,
      question
    };
    singleQue = data;
    this.setState({
      singleQue
    });
  };
  changeSelect = e => {
    let { input, currentSkills } = this.state;
    let removedSkill,
      a = [],
      b = [],
      c;
    if (e == null) {
      removedSkill = currentSkills[0].skillName;
      this.setState({
        [removedSkill]: null
      });
    } else if (e && currentSkills != null && currentSkills.length > e.length) {
      currentSkills.map(data => {
        a.push(data.skillName);
      });
      e.map(data => {
        b.push(data.skillName);
      });
      removedSkill = a.filter(function(obj) {
        return b.indexOf(obj) == -1;
      });
      removedSkill.map(data => {
        this.setState({
          [data]: null
        });
      });
    }
    this.setState({
      mySkills: e,
      currentSkills: e
    });
  };
  createUI = () => {
    let { skills } = this.state;
    if (skills && skills.length > 0) {
      skills.map((data, index) => {
        let obj = skills[index];
        obj.label = obj.skillName;
        obj.value = obj.skillName;
      });
    } else {
      return "N/A";
    }
    return (
      <Select
        isMulti
        name="skills"
        options={skills}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select Technology"
        onChange={e => {
          this.changeSelect(e);
        }}
      />
    );
  };
  toggle = tab => {
    let { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };
  deleteRecoard = (arr, id, index) => {
    let newArray = this.state[arr].splice(index, 1);
    this.setState({
      [arr]: this.state[arr],
      isUpdate: false,
      ofSkill: null,
      ofIndex: null
    });
    // if (this[`que${id}`]) {
    //   // console.log("this[`que${id}`]", this[`que${id}`].value);
    //   this[`que${id}`].value = "";
    // }
  };
  editRecoard = (skill, id, index, data) => {
    this.setState(
      {
        isUpdate: true,
        ofSkill: skill,
        ofIndex: index
      },
      () => {
        if (this[`que${id}`]) {
          // console.log("this[`que${id}`]", this[`que${id}`].value);
          this[`que${id}`].value = data.question;
        }
      }
    );
  };
  updateInput = (id) => {
    let { ofSkill, ofIndex } = this.state;
    let skillName = this.state[ofSkill];
    skillName.forEach((element, index) => {
      if (index === ofIndex) {
        element.question = this[`que${id}`].value;
        
      }               
    }); 
    this[`que${id}`].value = '';  
    
    this.setState({
      [ofSkill]: skillName,
      isUpdate: false,
      ofSkill: null,
      ofIndex: null
    });
  };
  createTab = () => {
    let { activeTab, mySkills, isUpdate } = this.state;
    let temp;
    try {
      if (mySkills) {
        return (
          <Fragment>
            <Nav tabs>
              {mySkills.map((data, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={classnames({ active: activeTab == index })}
                    onClick={() => {
                      this.toggle(index);
                    }}
                  >
                    
                    {data.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={activeTab}>
              {mySkills.map((data, index) => (
                <TabPane key={index} tabId={index}>
                  <Row>
                    <Col md="12">
                      <h4>Question:</h4>
                    </Col>
                  </Row>
                  <Row className="questionContent">
                    <Col md="8">                      
                      <textarea
                        className="questionText"
                        type="text"
                        
                        ref={input => {
                          this[`que${data.id}`] = input;
                        }}
                        id={`question${data.id}`}
                        onChange={e => {
                          this.addElement(data.label, e);
                        }}
                      />
                    </Col>
                    <Col md="4">
                      {!isUpdate ? (
                        <Button
                          color="primary"
                          onClick={() => this.addInput(data.label, data.id)}
                        >
                          Add
                        </Button>
                      ) : (
                        <Button color="info" onClick={() => this.updateInput(data.id)}>
                          Update
                        </Button>
                      )}
                    </Col>
                  </Row>
                  <div style={{ display: "none" }}>{(temp = data.label)}</div>

                  {this.state[temp] && this.state[temp][0] != undefined && (
                    <Row>
                      <Col>
                        <Table>
                          <thead>
                            <th>Index</th>
                            <th>Question</th>
                            <th>Edit</th>
                            <th>Remove</th>
                          </thead>
                          <tbody>
                            {this.state[temp].map((skillData, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{skillData.question}</td>
                                  <td>
                                    <a
                                      onClick={() =>
                                        this.editRecoard(
                                          data.label,
                                          data.id,
                                          index,
                                          skillData
                                        )
                                      }
                                    >
                                      <i
                                        class="fa fa-pencil-square-o"
                                        aria-hidden="true"
                                      ></i>
                                    </a>
                                  </td>
                                  <td>
                                    <a
                                      onClick={() =>
                                        this.deleteRecoard(
                                          data.label,
                                          data.id,
                                          index
                                        )
                                      }
                                    >
                                      <i
                                        className="fa fa-times removeIcon"
                                        aria-hidden="true"
                                      ></i>
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  )}
                </TabPane>
              ))}
            </TabContent>
          </Fragment>
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  addInput = (label, id) => {
    let { singleQue } = this.state;
    let tempName = label;
    if (this.state[tempName] == undefined) {
      this.setState({
        [tempName]: [singleQue],
        singleQue: null
      });
    } else {
      let existsArray = this.state[tempName];
      existsArray.push(singleQue);
      this.setState({
        [tempName]: existsArray,
        singleQue: null
      });
    }
    if (this[`que${id}`]) {
      // console.log("this[`que${id}`]", this[`que${id}`].value);
      this[`que${id}`].value = "";
    }
  };
  render() {
    let { active } = this.state;
    return (
      <Fragment>
        <Modal isOpen={active}>
          <ModalHeader>Associate Feedback</ModalHeader>
          <ModalBody>
          <span style={{ marginLeft: "3%"}}>Add technology-wise questions asked during the interview.</span>
            <div className="associateFeedback">
              
              <Row>
                <Col className="skills">{this.createUI()}</Col>
              </Row>
              <Row>
                <Col className="tabs">{this.createTab()}</Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.submitClicked}>
              Submit
            </Button>
            <Button color="secondary" onClick={this.closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(null, mapDispatchToProps)(Module);
