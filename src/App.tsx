import React from 'react'
import Game from './logics/Game'
import './assets/styles/App.scss'
import Camera from './models/Camera';
import { OrthoProjection, PerspectiveProjection } from './models/CameraProjection';

enum ProjectionMode {
    ORTHOGRAPHIC,
    PERSPECTIVE
}

export default class App extends React.Component {
    private game = new Game();
    private main_element: React.RefObject<HTMLDivElement | null> = React.createRef();
    private camera = new Camera();
    private projection_mode: ProjectionMode = ProjectionMode.ORTHOGRAPHIC;
    private orthoProjection = new OrthoProjection();
    private perspectiveProjection = new PerspectiveProjection();

    constructor() {
        super({});
    }

    onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    onMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    onMouseMove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    mainElementChanged() : void {
        if(this.main_element.current != null)
        {

        }
    }

    componentDidMount() {
        this.game.start();
    }

    componentWillUnmount(): void {
        this.game.stop();
    }

    render() {
        return React.createElement('div', { id: 'app', ref: (element)=>{this.main_element.current = element as HTMLDivElement; this.mainElementChanged(); } }, this.game.render(), (<div className="toolbar"><button>Change projection mode</button></div>));
    }
}
