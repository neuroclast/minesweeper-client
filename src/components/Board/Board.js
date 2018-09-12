import React, { Component } from 'react';
import './Board.css';
import Tile from '../Tile/Tile.js'

class Board extends Component {

    onClick = (event, x, y) => {
        if(this.props.gameOver) {
            return;
        }

        console.log("Revealed " + x + ", " + y);

        this.props.sendMessage(`/click/${this.props.channelId}/${this.props.userId}/1/${x}/${y}`);
    };


    onRightClick = (event, x, y) => {
        if(this.props.gameOver) {
            event.preventDefault();
            return;
        }

        console.log("Flagged " + x + ", " + y);

        event.preventDefault();

        this.props.sendMessage(`/click/${this.props.channelId}/${this.props.userId}/2/${x}/${y}`);
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
            <div style={{width: (this.props.width * 16) + "px", height: (this.props.height * 16) + "px"}} className="board">
                {Array.apply(null, { length: this.props.height }).map((e, y) => (
                    <div className='tileRow' key={'row'+y}>
                        {Array.apply(null, { length: this.props.width }).map((e, x) => (
                            <Tile
                                key={x + ',' + y}
                                value={ this.tileValue(x, y) }
                                x={x} y={y}
                                onRightClick={this.onRightClick}
                                onClick={this.onClick}
                                gameOver={this.props.gameOver}
                            >
                            </Tile>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}


export default Board;