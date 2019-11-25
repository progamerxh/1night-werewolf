import React, { Component } from 'react';
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
class JoinRoom extends Component {
    state = {
        roomName: '',
    }
    roomNameHandleChange = (e) => {
        this.setState({ roomName: e.target.value })
    }

    roomJoinHandle = () => {
        const { firebase, auth } = this.props;
        firebase.set(`rooms/${this.state.roomName}/players/${auth.uid}`,
            {
                displayName: auth.displayName,
                uid: auth.uid,
                photoURL: auth.photoURL,
            });
    }

    roomCreateHandle = () => {
        if(this.state.roomName === '')
            return;
        const { firebase } = this.props;
        firebase.set(`rooms/${this.state.roomName}`, true);
    }

    render() {
        return (
            <div className="room">
                <input className="roomname"
                    value={this.state.roomName}
                    onChange={this.roomNameHandleChange}
                    placeholder="Tên phòng..."
                ></input>

                <button className="joinroom"
                    onClick={this.roomJoinHandle}
                >
                    <Link to='/room'>Tham gia</Link>
                </button>
                <button className="createroom"
                    onClick={this.roomCreateHandle}
                >  <Link to='/mod'>Tạo phòng</Link>
                </button>
            </div>
        );
    }
}

export default compose(
    firebaseConnect(),
    connect((state) => ({
        auth: state.firebase.auth,
    }))
)(JoinRoom)