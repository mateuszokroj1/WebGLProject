import React from 'react'
import Game from './logics/Game'
import './assets/styles/App.scss'

export default class App extends React.Component {
    game = new Game();



    render() {
        return React.createElement('div', { id: 'app' }, this.game.render());

    }
}
