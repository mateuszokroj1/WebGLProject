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

        this.camera.projection = this.ortho_projection;
        this.game.camera = this.camera;
        this.game.renderer = this.renderer;
    }

    // Events

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

    private onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    private onResize = (e: Event) => {
        this.perspective_projection.aspect = (this.main_element.current as HTMLDivElement).clientWidth / (this.main_element.current as HTMLDivElement).clientHeight;
    }

    private mainElementChanged(): void {
        if (this.main_element.current != null) {
            this.main_element.current.addEventListener('mousedown', this.onMouseDown);
            this.main_element.current.addEventListener('mouseup', this.onMouseUp);
            this.main_element.current.addEventListener('mousemove', this.onMouseMove);
            this.main_element.current.addEventListener('wheel', this.onWheel);
            this.main_element.current.addEventListener('resize', this.onResize);

            this.perspective_projection.aspect = this.main_element.current.clientWidth / this.main_element.current.clientHeight;
        }
    }

    private changeProjectionMode(e: React.UIEvent): void {
        e.stopPropagation();

        if (this.projection_mode === ProjectionMode.ORTHOGRAPHIC) {
            this.camera.projection = this.perspective_projection;
            this.projection_mode = ProjectionMode.PERSPECTIVE;
        } else {
            this.camera.projection = this.ortho_projection;
            this.projection_mode = ProjectionMode.ORTHOGRAPHIC;
        }
    }

    private resetCameraSettings(e: React.UIEvent): void {
        e.stopPropagation();

        this.camera = new Camera();
        this.camera.position[2] = -5;
        this.camera.projection = this.ortho_projection;
        this.game.camera = this.camera;
    }

    // React lifecycle

    componentDidMount() {
        this.game.start();
    }

    componentWillUnmount(): void {
        this.game.stop();
    }

    render() {
        const toolbar = (<div className="toolbar">
            <button onClick={this.changeProjectionMode}>Change projection mode</button>
            <button onClick={this.resetCameraSettings}>Reset camera settings</button>
        </div>);

        return React.createElement('div', { id: 'app', ref: (element) => { this.main_element.current = element as HTMLDivElement; this.mainElementChanged(); } }, this.game.render(), toolbar);
    }
}
