import React, { Component } from 'react'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import { Button, ButtonToolbar } from 'react-bootstrap';
import AddClientGroupModal from "./AddClientGroupModal";
import UpdateClientGroupModal from './UpdateClientGroupModal';
import DeleteClientGroupModal from './DeleteClientGroupModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Card,
  CardBody,
  Row,
  Badge,
  Col,
  Form,
  Label,
  CardHeader
} from "reactstrap";
import {
  BootstrapTable,
  TableHeaderColumn,
  ExportCSVButton,
  SearchField,
  TableBodyColumn
} from "react-bootstrap-table";
import "react-widgets/dist/css/react-widgets.css";
import axios from 'axios';
class ClientGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      allClients: [],
      accessToken: '',
      tokenType: '',
      clientId: 0,
      clientData: {},
      updateClient: {},
      addModalShow: false,
      deleteModalShow: false,
      updateModalShow: false,
      message: ''
    };
    this.notify = this.notify.bind(this);
    this.setAllClientsData = this.setAllClientsData.bind(this);
  }

  buttonFormatter(cell, row, rowIndex, e) {
    return (
      <div>
        {/*<Button type="button" className="btn btn-primary" size="sm" onClick={() => this.setState({
         updateSkill : row, updateModalShow : true})}>Update</Button>*/}
        <i className="fa fa-pencil fa-xs updateIcon" onClick={() => this.setState({
          updateClient: row, updateModalShow: true
        })}></i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
       {/*<Button type="button" className="btn btn-danger" size="sm" onClick={() => this.setState({
         clientData : row,
         deleteModalShow : true
         })}>Delete</Button>*/}
        <i className="fa fa-trash-o fa-xs deleteIcon" onClick={() => this.setState({
          clientData: row,
          deleteModalShow: true
        })}></i>
      </div>
    )
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.clients && nextProps.clients.status) {
      return true;
    } else if (nextState != this.state) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    let { accessToken, tokenType } = this.props.userSession;
    this.setState({
      accessToken: accessToken,
      tokenType: tokenType
    });
    let data = { accessToken, tokenType };
    this.props.clientAction(data);
    // this.componentDidUpdate();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.clients && this.props.clients.status) {
      let { data, status } = this.props.clients;
      if (prevProps != this.props && status === 200) {
        let tempData = [];
        data.map((data, index) => {
          tempData.push({ ...data, index: ++index });
        });
        // this.setState(
        //   {
        //     clients: tempData
        //   });
        this.setAllClientsData(tempData);
      }
    }

  }

  setAllClientsData(clients) {
    var allClientDetails = [];
    if (clients) {
      // var clients = this.state.clients;
      for (let index = 0; index < clients.length; index++) {                     
        let client = {
          id: index ,          
          clientName: '',
          clientGroupName: '',
          clientGroupId: '',

        }
        // client.id = clients[index].id;
        
        client.clientName = clients[index].clientName;
        if (clients[index].clientGroups) {
          const groups = clients[index].clientGroups;
          if (groups.length > 0) {
            for (let i = 0; i < groups.length; ++i) {
              let client = {
                id: index ,          
                clientName: '',
                clientGroupName: '',
                clientGroupId: '',
                "Sr No": '',
                "client Name": '',
                "clientGroup Name": '',
                "clientGroup Id": '',
              }
              client.clientName = clients[index].clientName;
              client.clientGroupName = groups[i].groupName;
              client.id = clients[index].id;  
              client.clientGroupId = groups[i].id;   
              client["client Name"] = client.clientName;
              client["clientGroup Name"] = client.clientGroupName;
              client["clientGroup Id"] = client.id;
              client["Sr No"] = client.id;
              allClientDetails.push(client);
            }
          }
          else {
            client.clientGroupName = "No Data";
            allClientDetails.push(client);
          }
        }
      }
      var allClientWithoutClientGroups = allClientDetails.filter(client => client.clientGroupName !== "No Data");
      if (allClientDetails && allClientDetails[0]) {
        this.setState(
          {
            clients: allClientWithoutClientGroups
          });
      }
      }
  }

  notify = (msg) => toast.success(msg, {
    position: "bottom-right", autoClose: 2000, hideProgressBar: false,
    closeOnClick: true, pauseOnHover: true, draggable: true
  });

  closeSucess = () => {
    if (this.state.addModalShow === true) {
      this.setState({
        addModalShow: false,
        message: ''
      });
    }
    else if (this.state.updateModalShow === true) {
      this.setState({
        updateModalShow: false,
        message: ''
      });
    }
    else {
      this.setState({
        deleteModalShow: false,
        message: ''
      });
    }
  };
  render() {
    const clients = this.state.clients;
    // const allClients = this.state.allClients;
    let addModalShow = () => this.setState({ addModalShow: false });
    const options = {
      // page: 5,  // which page you want to show as default
      sizePerPageList: [
        {
          text: "5",
          value: 5
        },
        {
          text: "10",
          value: 10
        },
        {
          text: "All",
          value: clients && clients.length
        }
      ], // you can change the dropdown list for size per page
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "Prev", // Previous page button text
      nextPage: "Next", // Next page button text
      firstPage: "First", // First page button text
      lastPage: "Last", // Last page button text
      paginationPosition: "bottom", // default is bottom, top and both is all available
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
      // alwaysShowAllBtns: true // Always show next and previous button
      // withFirstAndLast: false > Hide the going to First and Last page button
      // paginationPanel: this.renderPaginationPanel
      // exportCSVBtn: this.createCustomExportCSVButton,
      // searchField: this.createCustomSearchField
    };
    return (
     
      <div className="animated fadeIn" style={{ backgroundColor: "#FFF" }}>
        <ToastContainer position="bottom-right"
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <Card>
          <CardBody className="upcoming-table">
            <Form className="customForm">
              <Row>
                <Col md={{ span: 4, offset: 4 }}>
                </Col>
                <Col md={3}>
                </Col>
                <Col md={2}>
                  <Button className="submitButton" onClick={this.formSubmit}>
                  </Button>
                </Col>
              </Row>

              {clients && (
                <BootstrapTable
                  data={clients}
                  className="bootStrapTable"
                  isKey={true}
                  ref="table"
                  pagination
                  keyField="id"
                  options={options}
                  search={true}
                  exportCSV
                  search
                  loading={true}
                >
                  <TableHeaderColumn                    
                    dataField="Sr No"
                    dataSort={true}
                    width={"8%"}
                  >
                    #
                  </TableHeaderColumn>

                  {/* {clients.clientGroups[0].length > 0 ? <TableHeaderColumn dataField={clients.clientGroup[0].groupName} dataSort={true}>
                    ClientGroup Name
                  </TableHeaderColumn> : <TableHeaderColumn >
                    ClientGroup Name
                  </TableHeaderColumn>
                  } */}
                  <TableHeaderColumn dataField="clientGroup Name" dataSort={true}>
                    Client Group Name
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="client Name" dataSort={true}>
                    Client Name
                  </TableHeaderColumn>

                   
                  <th >
                   <button className="clients_actions"  dataField="button" dataFormat={this.buttonFormatter.bind(this)}
                   editable={false}
                   >
                   Actions
                   </button> 
                   </th> 

                </BootstrapTable>
              )}

              <Button variant='success' onClick={() => this.setState({
                addModalShow: true
              })}>Add Client Group</Button>
              {this.state.addModalShow && (
                <AddClientGroupModal
                  close={this.closeSucess}
                  notifyAlert={this.notify} />
              )}
              {this.state.updateModalShow && (
                <UpdateClientGroupModal
                  close={this.closeSucess}
                  updateClient={this.state.updateClient}
                  notifyAlert={this.notify} />
              )}

              {this.state.deleteModalShow && (
                <DeleteClientGroupModal
                  close={this.closeSucess}
                  clientData={this.state.clientData}
                  notifyAlert={this.notify}
                />
              )}
            </Form>
          </CardBody>
        </Card>
      </div>
    )
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
)(ClientGroups);
