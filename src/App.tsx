import React from 'react';
import * as GLM from 'gl-matrix';
import Game from './logics/Game';
import './assets/styles/App.scss';
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

    private pointers: GLM.vec2[] = []

    private onMouseDown(e: MouseEvent): void {
        if (this.pointers.length > 0 || e.button != 0)
            return;

        e.preventDefault();
        e.stopPropagation();

        this.pointers = [GLM.vec2.fromValues(e.clientX, e.clientY)];
    }

    private onMouseUp(e: MouseEvent): void {
        if (this.pointers.length != 1)
            return;

        e.preventDefault();
        e.stopPropagation();

        this.pointers = [];
    }

    private onMouseMove(e: MouseEvent): void {
        if (this.pointers.length != 1)
            return;

        if (e.buttons != 1) {
            this.pointers = [];
            return;
        }

        e.preventDefault();
        e.stopPropagation();
    }

    private onWheel(e: WheelEvent): void {
        e.preventDefault();
        e.stopPropagation();
    }

    private onResize(): void {
        this.perspective_projection.aspect = (this.main_element.current as HTMLDivElement).clientWidth / (this.main_element.current as HTMLDivElement).clientHeight;
    }

    private onTouchStart(e: TouchEvent): void {
        if (this.pointers.length > 0)
            return;

        if (e.touches.length == 1) {
            this.pointers = [GLM.vec2.fromValues(e.touches[0].clientX, e.touches[0].clientY)];

            e.preventDefault();
            e.stopPropagation();
        }
        else if (e.touches.length == 2) {
            this.pointers = [GLM.vec2.fromValues(e.touches[0].clientX, e.touches[0].clientY), GLM.vec2.fromValues(e.touches[1].clientX, e.touches[1].clientY)];

            e.preventDefault();
            e.stopPropagation();
        }
    }

    private onTouchMove(e: TouchEvent): void {
        if (e.touches.length != this.pointers.length) {
            this.pointers = [];
            return;
        }
    }

    private onTouchStop(e: Event): void {
        if (this.pointers.length < 1)
            return;

        this.pointers = [];
        e.preventDefault();
        e.stopPropagation();
    }

    private mainElementChanged(): void {
        if (this.main_element.current != null) {
            this.main_element.current.addEventListener('mousedown', (e) => { this.onMouseDown(e) });
            this.main_element.current.addEventListener('mouseup', (e) => { this.onMouseUp(e) });
            this.main_element.current.addEventListener('mousemove', (e) => { this.onMouseMove(e) });
            this.main_element.current.addEventListener('wheel', (e) => { this.onWheel(e) });
            this.main_element.current.addEventListener('resize', () => { this.onResize() });
            this.main_element.current.addEventListener('touchstart', (e) => { this.onTouchStart(e) });
            this.main_element.current.addEventListener('touchmove', (e) => { this.onTouchMove(e) });
            this.main_element.current.addEventListener('touchcancel', (e) => { this.onTouchStop(e) });
            this.main_element.current.addEventListener('touchend', (e) => { this.onTouchStop(e) });

            this.onResize();
        }
    }

    private changeProjectionMode(e: React.UIEvent): void {
        e.preventDefault();
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
        e.preventDefault();
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
            <button onClick={(e) => { this.changeProjectionMode(e); }}>Change projection mode</button>
            <button onClick={(e) => { this.resetCameraSettings(e); }}>Reset camera settings</button>
        </div>);

        return React.createElement('div', { id: 'app', ref: (element) => { this.main_element.current = element as HTMLDivElement; this.mainElementChanged(); } }, this.game.render(), toolbar);
    }
}
