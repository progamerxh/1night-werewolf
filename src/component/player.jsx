import React, { Component } from 'react';
import roleimg from '../img/villager.jpg'
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty, getVal } from 'react-redux-firebase'

class Player extends Component {

    render() {
        const role = this.props.player.role;
        var roleimg;
        if (role)
            roleimg = require(`../img/${role}.jpg`)
        return (
            <div className="player">
                {role ? <div className="role">
                    <img src={roleimg} alt="" />
                </div> : null}
            </div>
        );
    }
}
export default compose(
    firebaseConnect((props) => [
        { path: `rooms/a/players/${props.auth.uid}` }
    ]),
    connect(({ firebase }, props) => ({
        player: getVal(firebase, `data/rooms/a/players/${props.auth.uid}`), // lodash's get can also be used
    })),
)(Player)