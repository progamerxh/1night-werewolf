import React, { Component } from 'react';
import JoinRoom from './joinroom';
import Player from './player';
import Moderator from './moderator';
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import requireAuth from './requireAuth';

class Home extends Component {

    logoutHandle = () => {
        this.props.firebase.logout();
    }
    render() {
        const auth = this.props.auth;
        return (
            <BrowserRouter>
                <div className="App">
                    <div className="Home">
                        <div className="user">
                            <img src={auth.photoURL} alt={auth.displayName} />
                            <div className="userName">{auth.displayName}</div>
                            <i className="fa fa-sign-out"
                                onClick={this.logoutHandle}
                            ></i>
                        </div>
                <Switch>
                    <Route exact path='/room' component={requireAuth(Player)}/>
                    <Route exact path='/mod' component={requireAuth(Moderator)}/>
                    <Route path='/' component={JoinRoom}/>
                </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default compose(
    firebaseConnect(),
    connect((state) => ({
        auth: state.firebase.auth,
    }))
)(Home)