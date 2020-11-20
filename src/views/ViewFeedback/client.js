import React, { Fragment, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Row,
  Col,
  Badge
} from "reactstrap";
import Moment from "moment";
Moment.locale("en");
export default function ClientFeedback(props) {
  const [activePopup, hidePopup] = useState(props.active);
  function closeModal() {
    hidePopup(false);
    props.closeModal();
  }
  function badge(status) {
    if (status === "SELECTED") {
      return <Badge color="success">Selected</Badge>;
    } else if (status === "REJECTED") {
      return <Badge color="danger">Rejected</Badge>;
    } else if (status === "ONHOLD") {
      return <Badge color="warning">On Hold</Badge>;
    } else if (status === "SCHEDULED") {
      return <Badge color="info">Scheduled</Badge>;
    }else if (status === "RESCHEDULED") {
      return <Badge color="info">Re-Scheduled</Badge>;
    }else if (status === "CANCELLED") {
      return <Badge color="info">Cancelled</Badge>;
    }
  }
  function createTable(data) {
    return (
      <Fragment>
        <Table>
          <thead>
            <th>Index</th>
            <th>Status</th>
            <th>Comment</th>
            <th>Date</th>
          </thead>
          {/* { let currentStatus = data.length - 1;
 <tr>
              <td>{data[currentStatus].statusId}</td>
              <td>{badge(data[currentStatus].clientFeedbackStatusEnum)}</td>
              <td>{data[currentStatus].comment}</td>
            </tr> */}
          <tbody>
            {data.map((record, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{badge(record.clientFeedbackStatusEnum)}</td>
                   <td> {record.comment === null? 'N/A':record.comment}</td>
                  <td>{Moment(record.updatedDate).format("DD/MM/YYYY")}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <Modal isOpen={activePopup} toggle={closeModal} lg>
        <ModalHeader toggle={closeModal}>Feedback of Client</ModalHeader>
        <ModalBody>
          <div className="associateFeedback">
            <Row>
              <Col className="tabs">{createTable(props.feedback)}</Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}
