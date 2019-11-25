import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

const roles = [
    'alpha_wolf',
    'apprentice_seer',
    'drunk',
    'hunter',
    'insominiac',
    'investigator',
    'mason',
    'minion',
    'mystic_wolf',
    'revealer',
    'robber',
    'seer',
    'tanner',
    'troublemaker',
    'village_idiot',
    'villager',
    'villager',
    'villager',
    'werewolf',
    'werewolf',
    'werewolf',
    'witch'
]

class Moderator extends Component {
    state = {
        selectedPlayer: '',
        middleCards: [],
        ignoreRoles: [],
        revealRole: '',
        textRole: '',
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    swapPlayerHandle(desPlayer) {
        const selectedPlayer = this.state.selectedPlayer;
        if (selectedPlayer) {
            this.props.firebase.set(`rooms/a/players/${desPlayer.uid}/role`, selectedPlayer.role);
            this.props.firebase.set(`rooms/a/players/${selectedPlayer.uid}/role`, desPlayer.role);
            this.setState({ selectedPlayer: '' })
        }
    }
    selectCardHandle(index) {
        var middleCards = this.state.middleCards.slice();
        const selectedPlayer = this.state.selectedPlayer;
        if (selectedPlayer) {
            this.props.firebase.set(`rooms/a/players/${selectedPlayer.uid}/role`, middleCards[index].role);
            middleCards[index].role = selectedPlayer.role;
            this.setState({ selectedPlayer: '' })
        }
        else {
            middleCards[index].show = !middleCards[index].show;
        }
        this.setState({ middleCards });
    }
    gameStartHandle = () => {
        const room = this.props.room;
        const ignoreRoles = this.state.ignoreRoles;
        var gameroles = roles.slice()
        for (let i = 0; i < gameroles.length;) {
            var found = false;
            for (let j = 0; j < ignoreRoles.length; j++)
                if (gameroles[i] === ignoreRoles[j]) {
                    found = true;
                    gameroles.splice(i, 1);
                }
            if (!found)
                i++;
        }
        var players;
        if (room) {
            players = room['a'].players
        }
        this.shuffleArray(gameroles);
        if (!isLoaded(room))
            return;
        else if (isEmpty(players))
            return;
        else {
            Object.keys(players).map((key, index) => {
                const player = players[key];
                this.props.firebase.set(`rooms/a/players/${player.uid}/role`, gameroles.pop());
                console.log(gameroles);
            })
            var middleCards = [];
            for (let i = 0; i < 3; i++) {
                middleCards[i] = { role: gameroles.pop(), show: false };
            }
            this.setState({ middleCards });
        }
    }
    textRoleChangeHandle = e => {
        this.setState({ textRole: e.target.value });
    }
    ignoreRoleSubmit = e => {
        e.preventDefault();
        this.setState({
            ignoreRoles: [...this.state.ignoreRoles, this.state.textRole],
            textRole: ''
        });
    }
    removeIgnoreRoleHandle(index) {
        var ignoreRoles = this.state.ignoreRoles;
        ignoreRoles.splice(index, 1);
        this.setState({ ignoreRoles });
    }
    render() {
        var revealImg;
        if (this.state.revealRole)
            revealImg = require(`../img/${this.state.revealRole}.jpg`);
        const middleCards = this.state.middleCards;
        const selectedStyle = {
            border: '1px solid #61dafb',
            borderRadius: '50px'
        }
        const room = this.props.room;
        var players;
        if (room) {
            players = room['a'].players
        }
        return (
            <div className="moderator">
                <h1>Chủ phòng</h1>
                <button onClick={this.gameStartHandle}>Bắt đầu</button>
                <div className="ignoreroles">
                    <div className="roles">
                        {this.state.ignoreRoles.map((role, index) => {
                            return <div
                                onClick={() => this.removeIgnoreRoleHandle(index)}
                                className="role"
                                key={index}>
                                {role}
                            </div>
                        })
                        }
                    </div>
                    <form onSubmit={this.ignoreRoleSubmit}>
                        <input
                            value={this.state.textRole}
                            onChange={this.textRoleChangeHandle}
                        ></input>
                    </form>
                </div>
                <div className="middlecard"
                >
                    {middleCards ? (
                        middleCards.map((card, index) => {
                            const roleimg = require(`../img/${card.role}.jpg`)
                            return <div className="card"
                                key={index}
                                onClick={() => this.selectCardHandle(index)}>
                                {card.show ? null : index + 1}
                                <img src={card.show ? roleimg : ''} alt="" />
                            </div>
                        })
                    ) : null
                    }
                </div>
                <div className="revealplayer">
                    {this.state.revealRole ?
                        <img src={revealImg} alt=""
                            onClick={() => this.setState({ revealRole: '' })} /> : null
                    }
                </div>
                <div className="players">
                    <ul>
                        {!isLoaded(room) ? <p>Loading...</p>
                            : isEmpty(players) ? <p>Empty</p>
                                : (Object.keys(players).map((key, index) => {
                                    const player = players[key];
                                    return <li key={index}>
                                        <div className="user"
                                            onClick={() => this.swapPlayerHandle(player)}
                                            style={(this.state.selectedPlayer && this.state.selectedPlayer.uid === player.uid) ?
                                                selectedStyle : {}}
                                        >
                                            <img src={player.photoURL} alt="" />
                                            <div className="userName">{player.displayName}</div>
                                            <i className="fa fa-eye"
                                                onClick={() => this.setState({ revealRole: player.role })}
                                            ></i>
                                            <i className="fa fa-exchange"
                                                onClick={() => this.setState({ selectedPlayer: player })}
                                            ></i>
                                        </div>
                                    </li>
                                }))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default compose(
    firebaseConnect((props) => [
        { path: 'rooms/a/players' }
    ]),
    connect((state) => ({
        room: state.firebase.data.rooms,
    }))
)(Moderator)