import React, { Fragment, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import classnames from "classnames";
// View Feedback of Associate 
export default function ViewFeedback(props) {
  let mySkills = [];  
  props.questions.map((data, index) => {    
    if (mySkills.length > 0) {
      let result = mySkills.filter(sdata => { return sdata.label == data.skillName })
      if (result && result[0] == undefined) {
        mySkills.push({ id: index++, label: data.skillName });
      }
    } else {
      mySkills.push({ id: index++, label: data.skillName });
    }
  });
  const [questions, setquestions] = useState(props.questions);
  const [active, setActive] = useState(0);
  const [skills, setSkills] = useState(mySkills);
  const [activePopup, hidePopup] = useState(props.active)
  function toggle(tab) {
    let activeTab = active;
    if (activeTab !== tab) {
      setActive(tab);
    }
  }
  function createTab() {
    let que;
    try {
      if (skills) {
        return (
          <Fragment>
            <Nav tabs>
              {skills.map((data, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={classnames({ active: active == data.id })}
                    onClick={() => {
                      toggle(data.id);
                    }}
                  >
                    {data.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            <TabContent activeTab={active}>
              {skills.map((data, index) => (
                <TabPane key={index} tabId={data.id}>
                  <Row>
                    <Col>
                      <Table>
                        <thead>
                          {/* <th>Index</th> */}
                          <th>Question</th>
                        </thead>
                        <tbody>                        
                          {questions.map((que, sid) => {                            
                            if (que.skillName == data.label) {
                              que = que.question;
                              return (
                                <Fragment key={sid}>
                                  <tr key={sid}>
                                    {/* <td>{sid + 1}</td> */}
                                    <td>{que}</td>
                                  </tr>
                                </Fragment>
                              );
                            }
                          })}

                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </TabPane>
              ))}
            </TabContent>
          </Fragment>
        );
      }
    } catch (error) {
      console.log("error =>", error);
    }
  }
  function closeModal() {
    hidePopup(false)
    props.closeModal();
  }
  return (
    <Fragment>
      <Modal isOpen={activePopup} toggle={closeModal} lg>
        <ModalHeader
          toggle={closeModal}
        >Questions Feedback by Associate</ModalHeader>
        <ModalBody>
          <div className="associateFeedback">
            <Row>
              <Col className="tabs">{createTab()}</Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

// export default class ViewFeedback extends Component {
//   constructor(props) {
//     super(props);
//     let mySkills = [];
//     this.props.questions.map((data, index) => {
//       mySkills.push({ id: index++, label: data.skillName });
//     });
//     this.state = {
//       questions: this.props.questions,
//       active: this.props.active,
//       mySkills,
//       activeTab: 0
//     };
//   }
//   toggle = tab => {
//     let { activeTab } = this.state;
//     if (activeTab !== tab) {
//       this.setState({
//         activeTab: tab
//       });
//     }
//   };
//   createTab = () => {
//     let { activeTab, mySkills } = this.state;
//     let que;
//     try {
//       if (mySkills) {
//         return (
//           <Fragment>
//             <Nav tabs>
//               {mySkills.map((data, index) => (
//                 <NavItem key={index}>
//                   <NavLink
//                     className={classnames({ active: activeTab == data.id })}
//                     onClick={() => {
//                       this.toggle(data.id);
//                     }}
//                   >
//                     {data.label}
//                   </NavLink>
//                 </NavItem>
//               ))}
//             </Nav>
//             <TabContent activeTab={activeTab}>
//               {mySkills.map((data, index) => (
//                 <TabPane key={index} tabId={data.id}>
//                   <Row>
//                     <Col>
//                       <Table>
//                         <thead>
//                           <th>Index</th>
//                           <th>Question</th>
//                         </thead>
//                         <tbody>
//                           {this.state.questions.map((skill, sid) => {
//                             if (skill.skillName == data.label) {
//                               que = skill.questions;
//                               return (
//                                 <Fragment key={sid}>
//                                   {que.map((question, qindex) => (
//                                     <tr>
//                                       <td>{qindex + 1}</td>
//                                       <td>{question}</td>
//                                     </tr>
//                                   ))}
//                                 </Fragment>
//                               );
//                             }
//                           })}
//                         </tbody>
//                       </Table>
//                     </Col>
//                   </Row>
//                 </TabPane>
//               ))}
//             </TabContent>
//           </Fragment>
//         );
//       }
//     } catch (error) {
//       console.log("error =>", error);
//     }
//   };
//   closeModal = () => {
//     this.setState({
//       active: false
//     });
//     this.props.closeModal();
//   };
//   render() {
//     let { active } = this.state;
//     return (
//       <Fragment>
//         <Modal isOpen={active} toggle={this.closeModal}>
//           <ModalHeader toggle={this.closeModal}>View Feedback</ModalHeader>
//           <ModalBody>
//             <div className="associateFeedback">
//               <Row>
//                 <Col className="tabs">{this.createTab()}</Col>
//               </Row>
//             </div>
//           </ModalBody>
//         </Modal>
//       </Fragment>
//     );
//   }
// }
