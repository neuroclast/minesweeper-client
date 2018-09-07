import React, { Component } from 'react';
import './Board.css';
import Tile from '../Tile/Tile.js'
import {constants} from '../../constants.js';

class Board extends Component {

    onClick = (event, x, y) => {
        console.log("Revealed " + x + ", " + y);

        this.props.sendMessage(`/click/${this.props.channelId}/1/${x}/${y}`);
    };


    onRightClick = (event, x, y) => {
        console.log("Flagged " + x + ", " + y);

        event.preventDefault();

        let newState = this.state.boardState.slice();

        if(this.state.boardState[y][x] === constants.blank) {
            newState[y][x] = constants.flagged;
        }
        else if(this.state.boardState[y][x] === constants.flagged) {
            newState[y][x] = constants.blank;
        }

        this.setState({
            boardState: newState
        });
    };

    tileValue = (x, y) => {
        let tile = this.props.tiles.find(tile => { return tile.x === x && tile.y === y; });

        if(tile === undefined) {
            return undefined;
        }

        return tile.state;
    };

    render() {
        return (
            <div>
                {Array.apply(null, { length: this.props.height }).map((e, y) => (
                    <div className='tileRow' key={'row'+y}>
                        {Array.apply(null, { length: this.props.width }).map((e, x) => (
                            <Tile
                                key={x + ',' + y}
                                value={ this.tileValue(x, y) }
                                x={x} y={y}
                                onRightClick={this.onRightClick}
                                onClick={this.onClick}>
                            </Tile>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}


export default Board;