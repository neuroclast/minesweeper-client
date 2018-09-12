import React, { Component } from 'react';
import './Log.css';

class Log extends Component {

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.el.scrollTop = this.el.scrollHeight;
    }

    formatLogs = () => {
        let output = "";

        this.props.logs.forEach(item => {
            output += "\r\n" + item;
        });

        return output;
    };

    render() {
        return (
            <textarea
                className="logContainer"
                readOnly="true"
                rows="4"
                value={this.formatLogs()}
                ref={el => { this.el = el; }}
            > </textarea>
        );
    }
}

export default Log;