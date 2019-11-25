import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEmpty } from "react-redux-firebase";

export default function (ComposedComponent) {

  class Authentication extends Component {
    static contextTypes = {
      auth: PropTypes.object
    };

    render() {
      if (!isEmpty(this.props.auth)) {
        return <ComposedComponent {...this.props} />;
      }
      return null;
    }
  }

  function mapStateToProps(state) {
    return { auth: state.firebase.auth };
  }

  return connect(mapStateToProps)(Authentication);
}