import React, {Component} from 'react';
import './Header.css';
import faceUpImg from './img/faceUp.gif'
import faceDownImg from './img/faceDown.gif'
import faceOverImg from './img/faceOver.gif'
import faceDeadImg from './img/faceDead.gif'

class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isDown: false
        };
    }


    onClick = (event) => {
        console.log("Reset game");

        this.props.sendMessage(`/reset/${this.props.channelId}/${this.props.userId}`);
    };


    faceImg = () => {
        if(this.props.gameOver && !this.state.isDown) {
            return faceDeadImg;
        }

        if(!this.props.gameOver && this.props.mouseDown) {
            return faceOverImg;
        }

        if(this.state.isDown) {
            return faceDownImg;
        }

        return faceUpImg;
    };


    render() {
        return (
            <div className="headerContainer">
                <button className="faceButton"
                        onMouseDown={() => this.setState({isDown: true})}
                        onMouseUp={() => this.setState({isDown: false})}
                        onMouseOut={() => this.setState({isDown: false})}
                        onClick={(event) => this.onClick(event)}
                        onContextMenu={(event) => event.preventDefault()}>
                    <img src={this.faceImg()} alt="" draggable="false"/>
                </button>
            </div>
        );
    }
}

export default Header;