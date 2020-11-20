import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
	
	const currentYear = new Date().getFullYear();
	
    return (
      <React.Fragment>
        <span><a href="https://you.yash.com">Yash Technologies</a> &copy; {currentYear}.</span>
        <span className="ml-auto">Powered by <a href="https://you.yash.com">Yash Technologies Pvt. Ltd.</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
