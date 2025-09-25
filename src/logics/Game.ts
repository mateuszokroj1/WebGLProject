import React from 'react'
import IGame from '../interfaces/IGame'
import IRenderer from '../interfaces/IRenderer'

export default class Game extends React.Component implements IGame {
assignRenderer(renderer : IRenderer): void {
    throw new Error('Method not implemented.')
}
start(): void {
    throw new Error('Method not implemented.')
}
stop(): void {
    throw new Error('Method not implemented.')
}
zoom(): void {
    throw new Error('Method not implemented.')
}
move(): void {
    throw new Error('Method not implemented.')
}
render() {
    
}
}