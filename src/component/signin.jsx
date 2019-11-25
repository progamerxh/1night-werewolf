import React, { Component } from "react";
import { connect } from "react-redux";
import logo from '../img/logo.png';
import PropTypes from "prop-types";
import { Redirect } from 'react-router-dom'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

export class Signin extends Component {

    static contextTypes = {
        firebase: PropTypes.shape({
            login: PropTypes.func.isRequired
        }),
        auth: PropTypes.object
    };

    render() {
        const { auth, firebase } = this.props;
        if (!isLoaded(auth)) {
            return (
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>
                    ONENIGHT WEREWOLF
                         </h2>
                </header>
            )
        }
        else if (isEmpty(auth)) {
            return (
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>
                        ONENIGHT WEREWOLF
                         </h2>
                    <div id="customBtn" className="customGPlusSignIn"
                        onClick={() => { firebase.login({ provider: 'google', type: 'popup' }) }}
                    >
                        <span className="icon"></span>
                        <span className="buttonText">Sign in with Google</span>
                    </div>
                </header>
            );
        }
        return <Redirect to='/home' />

    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
};

export default compose(
    firebaseConnect(),
    connect(
        mapStateToProps
    )
)(Signin);