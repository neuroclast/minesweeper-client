import React, { Component } from 'react';
import SockJsClient from 'react-stomp';
import queryString from 'query-string'
import Board from '../Board/Board'
import {constants} from '../../constants.js';
import './Game.css';
import Header from "../Header/Header";
import Log from "../Log/Log";

class Game extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(props.location.search);

        this.state = {
            wsConnected: false,
            boardLoaded: false,
            lastError: queryParams.channelId === undefined || queryParams.userId === undefined ? "Missing parameter 'channelId' or 'userId" : null,
            boardWidth: 8,
            boardHeight: 8,
            tiles: [],
            channelID: queryParams.channelId,
            userID: queryParams.userId,
            mouseDown: false,
            gameOver: false,
            logs: []
        };
    }


    onMessageReceive = (msg, topic) => {
        if(msg.type === "error") {
            this.setState(prevState => ({
                lastError: msg.message
            }));
        }
        // load board
        else if(msg.type === "initial") {
            console.log("Loaded game board.");

            this.setState({
                boardWidth: msg.contents.width,
                boardHeight: msg.contents.height,
                tiles: msg.contents.tiles,
                boardLoaded: true,
                gameOver: false
            });
        }
        // loss
        else if(msg.type === "loss") {
            console.log("Loaded game over board.");

            this.setState({
                boardWidth: msg.contents.width,
                boardHeight: msg.contents.height,
                tiles: msg.contents.tiles,
                boardLoaded: true,
                gameOver: true
            });
        }
        // log entries
        else if(msg.type === "log") {
            console.log("Added log entry.");

            this.setState(prevState => ({
                logs: [...prevState.logs, msg.message]
            }));
        }
        // update board
        else if(msg.type === "update") {
            console.log("Updated game board.");

            let tileIndex = this.state.tiles.findIndex(tile => { return tile.x === msg.contents.x && tile.y === msg.contents.y; });
            if(tileIndex === -1) {
                this.setState(prevState => ({
                    tiles: [...prevState.tiles, msg.contents]
                }));
            }
            else {
                let newTiles = this.state.tiles.slice();
                tileIndex = newTiles.findIndex(tile => { return tile.x === msg.contents.x && tile.y === msg.contents.y; });
                newTiles[tileIndex] = msg.contents;

                this.setState({
                    tiles: newTiles
                });
            }
        }
    };


    onConnect = () => {
        console.log("Socket connected to server.");

        this.setState({wsConnected: true});

        this.sendMessage(`/load/${this.state.channelID}/${this.state.userID}`);
    };


    sendMessage = (endpoint, msg) => {
        if(!this.state.wsConnected) {
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


    handleMouse = (event, mouseDown) => {
        if(this.state.gameOver) {
            this.setState({
                mouseDown: false
            });
            return;
        }

        this.setState({
            mouseDown: mouseDown
        });
    };


    render() {
        if(this.state.lastError != null) {
            return <div>{this.state.lastError}</div>;
        }

        let renderElements = [
                <SockJsClient url={constants.wsUrl} topics={[`/topic/minesweeper/${this.state.channelID}`, '/user/queue/minesweeper']}
                                 onMessage={ this.onMessageReceive } ref={ (client) => { this.clientRef = client }}
                                 onConnect={ () => { this.onConnect() } }
                                 onDisconnect={ () => { this.setState({ wsConnected: false }) } }
                                 debug={ true }
                                 key="sockClient" />
            ];

        if(this.state.boardLoaded) {
            renderElements.push(
                <div key="gameContainer" className="gameContainer"
                     onMouseDown={(event) => {this.handleMouse(event, true)}}
                     onMouseUp={(event) => {this.handleMouse(event, false)}}
                     onMouseOut={(event) => {this.handleMouse(event, false)}}
                >
                    <Header
                        width={this.state.boardWidth}
                        sendMessage={this.sendMessage}
                        channelId={this.state.channelID}
                        userId={this.state.userID}
                        mouseDown={this.state.mouseDown}
                        gameOver={this.state.gameOver}
                    />
                    <Board
                        width={this.state.boardWidth}
                        height={this.state.boardHeight}
                        tiles={this.state.tiles}
                        sendMessage={this.sendMessage}
                        channelId={this.state.channelID}
                        userId={this.state.userID}
                        gameOver={this.state.gameOver}
                    />
                    <Log
                        logs={this.state.logs}
                    />
                </div>
            );
        }

        return renderElements;
    }
}

export default Game;