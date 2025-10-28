import React from 'react';
import * as GLM from 'gl-matrix';
import Game from './logics/Game';
import './assets/styles/App.scss';
import Camera from './models/Camera';
import { OrthoProjection, PerspectiveProjection } from './models/CameraProjection';
import WebGlRenderer from './renderer/WebGlRenderer';
import MyScene from './MyScene';
import { angleReduction, fmod } from './tools/Functions';

enum ProjectionMode {
    ORTHOGRAPHIC,
    PERSPECTIVE
}

enum ManipulationMode {
    NONE = 0,
    ROTATE,
    ZOOM,
    PAN
}

export default class App extends React.Component {
    private readonly LEFT_MOUSE_BUTTON = 0b1;
    private readonly RIGHT_MOUSE_BUTTON = 0b10;

    private game = new Game();
    private main_element: React.RefObject<HTMLDivElement | null> = React.createRef();
    private renderer = new WebGlRenderer();
    private camera = new Camera();
    private projection_mode: ProjectionMode = ProjectionMode.PERSPECTIVE;
    private ortho_projection = new OrthoProjection();
    private perspective_projection = new PerspectiveProjection();

    constructor(props: any) {
        super(props);

        this.resetCameraImpl();

        this.camera.projection = this.perspective_projection;
        this.game.camera = this.camera;
        this.game.renderer = this.renderer;
        this.game.lights_configuration = {
            ambient_light_color: GLM.vec3.fromValues(0.5, 0.5, 1),
            diffuse_light_position: GLM.vec3.fromValues(-1, 1, 5),
            diffuse_light_color: GLM.vec3.fromValues(1, 1, 0),
            specular_light_position: GLM.vec3.fromValues(-1, 10, 5)
        };

        this.game.scene_graph = new MyScene;
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

        this.game.requestRenderingProcess(window);
    }

    private resetCameraImpl(): void {
        this.camera.position = GLM.vec3.fromValues(0, 0, -5);
        this.camera.rotation_angles = GLM.vec3.fromValues(40, 45, 0);
    }

    private resetCameraSettings(e: React.UIEvent): void {
        e.preventDefault();
        e.stopPropagation();

        this.resetCameraImpl();
        this.camera.projection = this.perspective_projection;
        this.projection_mode = ProjectionMode.PERSPECTIVE;

        this.game.requestRenderingProcess(window);
    }

    // Events
    private manipulation_mode: ManipulationMode = ManipulationMode.NONE;

    private onMouseDown(e: MouseEvent): void {
        if (this.manipulation_mode != ManipulationMode.NONE || (e.buttons & ~(this.LEFT_MOUSE_BUTTON | this.RIGHT_MOUSE_BUTTON)) > 0)
            return;

        e.preventDefault();
        e.stopPropagation();

        if ((e.buttons & this.LEFT_MOUSE_BUTTON) > 0)
            this.manipulation_mode = ManipulationMode.ROTATE;
        else if ((e.buttons & this.RIGHT_MOUSE_BUTTON) > 0)
            this.manipulation_mode = ManipulationMode.PAN;
    }

    private onMouseUp(e: MouseEvent): void {
        if (this.manipulation_mode == ManipulationMode.NONE)
            return;

        e.preventDefault();
        e.stopPropagation();

        this.manipulation_mode = ManipulationMode.NONE;
    }

    private onMouseMove(e: MouseEvent): void {
        if (this.manipulation_mode != ManipulationMode.ROTATE && this.manipulation_mode != ManipulationMode.PAN)
            return;

        if ((e.buttons & ~(this.LEFT_MOUSE_BUTTON | this.RIGHT_MOUSE_BUTTON)) > 0) {
            this.manipulation_mode = ManipulationMode.NONE;
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const manipulation_scale = e.shiftKey ? 0.05 : 0.5;
        if (this.manipulation_mode == ManipulationMode.ROTATE) {


            if (e.ctrlKey) {
                this.camera.rotation_angles[2] -= e.movementX * manipulation_scale;
                this.camera.rotation_angles[2] = angleReduction(this.camera.rotation_angles[2]);
            }
            else {
                this.camera.rotation_angles[1] += e.movementX * manipulation_scale;
                this.camera.rotation_angles[0] += e.movementY * manipulation_scale;
                this.camera.rotation_angles[0] = angleReduction(this.camera.rotation_angles[0]);
                this.camera.rotation_angles[1] = angleReduction(this.camera.rotation_angles[1]);
            }
        }
        else if (this.manipulation_mode == ManipulationMode.PAN) {
            this.camera.position[0] += e.movementX * manipulation_scale * 0.05;
            this.camera.position[1] -= e.movementY * manipulation_scale * 0.05;
        }

        this.game.requestRenderingProcess(window);
    }

    private onWheel(e: WheelEvent): void {
        this.camera.position[2] -= e.deltaY * 0.005;
        this.camera.position[2] = Math.min(Math.max(this.camera.position[2], -500), -2);

        e.preventDefault();
        e.stopPropagation();

        this.game.requestRenderingProcess(window);
    }

    private onResize(): void {
        const width = (this.main_element.current as HTMLDivElement).clientWidth;
        const height = (this.main_element.current as HTMLDivElement).clientHeight;
        const aspect_ratio = width / height;

        this.game.frame_size = GLM.vec2.fromValues(width, height);
        this.perspective_projection.aspect = aspect_ratio;
        this.ortho_projection.aspect = aspect_ratio;

        this.game.requestRenderingProcess(window);
    }

    private onTouchStart(e: TouchEvent): void {
        if (this.manipulation_mode != ManipulationMode.NONE)
            return;

        if (e.touches.length == 1)
            this.manipulation_mode = ManipulationMode.ROTATE;
        else if (e.touches.length == 2)
            this.manipulation_mode = ManipulationMode.ZOOM;
        else
            return;

        e.preventDefault();
        e.stopPropagation();

        this.game.requestRenderingProcess(window);
    }

    private onTouchMove(e: TouchEvent): void {
        /*if (this.manipulation_mode == ManipulationMode.ROTATE && e.touches.length == 1) {

        }
        else if (this.manipulation_mode == ManipulationMode.ZOOM && e.touches.length == 2) {
        }
        else {
            this.manipulation_mode = ManipulationMode.NONE;
            return;
        }

        this.game.requestRenderingProcess(window);

        e.preventDefault();
        e.stopPropagation();*/
    }

    private onTouchStop(e: Event): void {
        if (this.manipulation_mode == ManipulationMode.NONE)
            return;

        this.manipulation_mode = ManipulationMode.NONE;

        e.preventDefault();
        e.stopPropagation();
    }

    private mainElementChanged(): void {
        if (this.main_element.current != null) {
            this.main_element.current.addEventListener('mousedown', (e) => { this.onMouseDown(e) });
            this.main_element.current.addEventListener('mouseup', (e) => { this.onMouseUp(e) });
            this.main_element.current.addEventListener('mousemove', (e) => { this.onMouseMove(e) });
            this.main_element.current.addEventListener('wheel', (e) => { this.onWheel(e) });
            this.main_element.current.addEventListener('touchstart', (e) => { this.onTouchStart(e) });
            this.main_element.current.addEventListener('touchmove', (e) => { this.onTouchMove(e) });
            this.main_element.current.addEventListener('touchcancel', (e) => { this.onTouchStop(e) });
            this.main_element.current.addEventListener('touchend', (e) => { this.onTouchStop(e) });
            window.addEventListener('resize', () => { this.onResize() });

            this.onResize();
        }
    }

    // React lifecycle

    async componentDidMount(): Promise<void> {
        await this.game.start();
        this.game.requestRenderingProcess(window);
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
