import React from 'react'
import Game from './logics/Game'
import './assets/styles/App.scss'

export default class App extends React.Component {
    game = Game()

    

    render() {
return React.createElement('div', { id: 'app' }, {game.render()});

    }
}
