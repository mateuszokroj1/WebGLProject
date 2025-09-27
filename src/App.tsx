import React from 'react'
import Game from './logics/Game'
import './assets/styles/App.scss'
import Camera from './models/Camera';
import { OrthoProjection, PerspectiveProjection } from './models/CameraProjection';
import WebGlRenderer from './renderer/WebGlRenderer';

enum ProjectionMode {
    ORTHOGRAPHIC,
    PERSPECTIVE
}

export default class App extends React.Component {
    private game = new Game();
    private main_element: React.RefObject<HTMLDivElement | null> = React.createRef();
    private renderer = new WebGlRenderer();
    private camera = new Camera();
    private projection_mode: ProjectionMode = ProjectionMode.ORTHOGRAPHIC;
    private ortho_projection = new OrthoProjection();
    private perspective_projection = new PerspectiveProjection();

    constructor(props: any) {
        super(props);
        
        this.camera.position[2] = -5;
        //this.ortho_projection.

        this.camera.projection = this.ortho_projection;
        this.game.assignCamera(this.camera);
        this.game.assignRenderer(this.renderer);
    }

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    private onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    private onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    private mainElementChanged() : void {
        if(this.main_element.current != null)
        {
            this.main_element.current.addEventListener('mousedown', this.onMouseDown);
            this.main_element.current.addEventListener('mouseup', this.onMouseUp);
            this.main_element.current.addEventListener('mousemove', this.onMouseMove);
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
