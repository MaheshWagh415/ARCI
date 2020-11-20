import React from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
function ProxyComponent(props) {
    if(props.userSession.user.roleName[0] === "ROLE_USER")
    return (
        <Redirect to='/statistics' />
    )
    else if(props.userSession.user.roleName[0] === "ROLE_ADMIN")
    return(
        <Redirect to='/dashboard' />
    )
    else
    return(
        <Redirect to='/login' />
    )
}
export const mapStateToProps = state => {
  return {
    userSession: state.session,
  };
};
export default connect(
  mapStateToProps,
null
)(ProxyComponent);