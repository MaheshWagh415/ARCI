import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import {
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import Moment from "moment";
import axios from 'axios';
import { Link } from 'react-router-dom';
class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      unreadCount: 0,
      display: ''
    };
  }

  componentDidMount() {
    let { accessToken, tokenType } = this.props.userSession;
    this.setState({
      accessToken: accessToken,
      tokenType: tokenType
    });
    let data = { accessToken, tokenType };
    if(this.props.userSession.roleName.indexOf("ROLE_USER")===0)
         this.props.notificationAction(data);
    
      setTimeout((props) => {
        setInterval((props) => {
          if(this.props.userSession.roleName.indexOf("ROLE_USER")===0){
              this.props.notificationAction(data);
          }
        }, 20000);
      }, 30000);
      this.componentDidUpdate();
   

  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.notifications && this.props.notifications.status) {
      let { data, status } = this.props.notifications;
      if (prevProps != this.props && status === 200) {
        let tempData = [];
        data.map((data, index) => {
          tempData.push({ ...data, index: ++index });
        });
        const unread = data.filter(temp => temp.notificationStatusType === "UNREAD");
        this.setState(
          {
            notifications: tempData,
            unreadCount: unread
          });
      }
    }
  }
  closeNotication = () => {
    
    this.setState({ display: 'none' });
  }
searchNotication = (associateId) => {
  console.log("searchNotication", associateId)
  localStorage.setItem('associateId',associateId);
  this.closeNotication();
}
  openDropDown = () => {
    this.setState({ display: 'block' });
  }
  render() {
    const notifications = this.state.notifications;
    const unreadCount = this.state.unreadCount;
    const notVal = this.state.display;

    return (
      <UncontrolledDropdown nav direction="down">
        <DropdownToggle nav onClick={this.openDropDown}>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link notification">
              <i className="fa fa-bell"><span className="badge badge-danger badgeStyle">{unreadCount.length}</span></i>
            </NavLink>
          </NavItem>
        </DropdownToggle>
        <DropdownMenu right style={{ display: this.state.display }}>
          <div tabIndex="-1" className={notifications.length > 10 ? 'dropdown-header dropdown-menu"' : 'dropdown-header dropdown-menu1'}>
            <strong>You have {notifications.length} notifications!</strong>
            <button type="button" className="close" aria-label="Close" onClick={this.closeNotication} style={{ backgroundColor: "transparent", marginLeft: "10%", color: "red" }}>
              <i aria-hidden="true" style={{ position: "absolute", marginTop: "-1%" }}>&times;</i></button>
          </div>
          {notifications.reverse().map(notification => {
            var dateTime = Moment(notification.createdOn).fromNow();
            return <div className="notificationDiv" key={notification.id}><Link to="/search" onClick = {this.searchNotication.bind(this, notification.userIds)} className="linkStyle">
              <small className="notificationTitle"><strong>{notification.title}</strong></small>
              <small className="createdOn float-right mt-1">{dateTime}</small>
            </Link>
            </div>

          })}

          <DropdownItem className="viewAll">View All</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
}

export const mapStateToProps = state => {
  return {
    userSession: state.session.user,
    notifications: state.userReducer.notifications
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(Notifications);