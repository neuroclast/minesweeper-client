import React, { Component } from 'react';
import {constants} from '../../constants.js';
import './Tile.css';
import mineImg from './img/mine.gif'
import mineExplodedImg from './img/mine_exploded.gif'
import blankImg from './img/blank.gif'
import blankDownImg from './img/blank_down.gif'
import flagImg from './img/flag.gif'

import oneImg from './img/1.gif';
import twoImg from './img/2.gif';
import threeImg from './img/3.gif';
import fourImg from './img/4.gif';
import fiveImg from './img/5.gif';
import sixImg from './img/6.gif';
import sevenImg from './img/7.gif';
import eightImg from './img/8.gif';

let numberMap = {
    0: blankDownImg,
    1: oneImg,
    2: twoImg,
    3: threeImg,
    4: fourImg,
    5: fiveImg,
    6: sixImg,
    7: sevenImg,
    8: eightImg
};

class Tile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isDown: false
        };
    }

    render() {
        if(this.props.value === undefined) {
            return (
                <button className="tileBlank"
                           onMouseDown={() => this.setState({isDown:true})}
                           onMouseUp={() => this.setState({isDown:false})}
                           onMouseOut={() => this.setState({isDown:false})}
                           onClick={(event) => this.props.onClick(event, this.props.x, this.props.y)}
                           onContextMenu={(event) => this.props.onRightClick(event, this.props.x, this.props.y)}>
                    <img src={!this.state.isDown ? blankImg : blankDownImg} alt="" draggable="false" />
                </button>
            );
        }
        else if(this.props.value === constants.mine) {
            return (
                <button className="tileImgContainer">
                    <img src={mineImg} alt="mine" onContextMenu={(event) => event.preventDefault()} />
                </button>
            );
        }
        else if(this.props.value === constants.explodedMine) {
            return (
                <button className="tileImgContainer">
                    <img src={mineExplodedImg} alt="mine" onContextMenu={(event) => event.preventDefault()} />
                </button>
            );
        }
        else if(this.props.value === constants.flagged) {
            return (
                <button className="tileImgContainer">
                    <img src={flagImg} alt="flagged"
                         onContextMenu={(event) => this.props.onRightClick(event, this.props.x, this.props.y)} />
               </button>
            );
        }
        else {
            return (
                <button className="tileImgContainer">
                    <img src={numberMap[this.props.value]} alt={this.props.value} onContextMenu={(event) => event.preventDefault()} />
                </button>
            );
        }
    }
}

export default Tile;