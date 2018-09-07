import React, {Component} from 'react';
import Game from "./components/Game/Game.js"
import {Route} from "react-router-dom";
import './App.css';

class App extends Component {
    render() {
        return (
            <Route path="/" component={Game} />
        );
    }
}

export default App;