import React, { Component } from 'react';
import SockJsClient from 'react-stomp';
import queryString from 'query-string'
import Board from '../Board/Board'
import './Game.css';

class Game extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(props.location.search);

        if(queryParams.channelId !== undefined) {
            this.state = {
                clientConnected: false,
                boardState: {},
                channelID: queryParams.channelId
            };
        }
    }


    onMessageReceive = (msg, topic) => {
        // reconstruct board
        if(msg.width !== undefined && msg.height !== undefined) {
            console.log("Updated game board.");

            this.setState({
                boardState: msg
            });
        }
    };


    onConnect = () => {
        console.log("Socket connected to server.");

        this.setState({clientConnected: true});

        this.sendMessage(`/load/${this.state.channelID}`);
    };


    sendMessage = (endpoint, msg) => {
        if(!this.state.clientConnected) {
            console.log("Socket not connected.");
            return false;
        }

        try {
            this.clientRef.sendMessage(`/minesweeper${endpoint}`, JSON.stringify(msg));
            return true;
        } catch(e) {
            return false;
        }
    };


    render() {

        if(this.state === null) {
            return <div>Missing parameter 'channelId'.</div>;
        }

        let renderElements = [
                <SockJsClient url='http://localhost:8080/ws' topics={[`/topic/minesweeper/${this.state.channelID}`, '/user/queue/minesweeper']}
                                 onMessage={ this.onMessageReceive } ref={ (client) => { this.clientRef = client }}
                                 onConnect={ () => { this.onConnect() } }
                                 onDisconnect={ () => { this.setState({ clientConnected: false }) } }
                                 // debug={ true }
                                 key="sockClient" />
            ];

        if(this.state.clientConnected) {
            renderElements.push(
                <Board
                    width={this.state.boardState.width}
                    height={this.state.boardState.height}
                    tiles={this.state.boardState.tiles}
                    sendMessage={this.sendMessage}
                    channelId={this.state.channelID}
                    key="gameBoard"
                />
            );
        }

        return renderElements;
    }
}

export default Game;