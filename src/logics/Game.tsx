import React from 'react'
import IGame from '../interfaces/IGame'
import IRenderer from '../interfaces/IRenderer'

export default class Game extends React.Component implements IGame {
    constructor() {
        super({})
        this.frameElement = React.createRef();
    }

    private frameElement;
    private renderer: IRenderer | null = null;

assignRenderer<TRenderer extends IRenderer>(): void {
    
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
    return (<canvas className="game" ref={this.frameElement} />);
}
}