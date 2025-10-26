import * as GLM from "gl-matrix";
import React from 'react';
import IGame from '../interfaces/IGame';
import IRenderer from '../interfaces/IRenderer';
import Camera from '../models/Camera';
import { ISceneGraphComponent } from '../interfaces/ISceneGraph';
import { EmptyScene } from './SceneGraph';
import { canInitialize } from '../tools/Functions';
import ILightsConfiguration from "../interfaces/ILightsConfiguration";
import SharedMutex from "./SharedMutex";

export default class Game extends React.Component implements IGame {
    constructor() {
        super({});
        this.frame_element = React.createRef<HTMLCanvasElement>();
    }

    componentWillUnmount(): void {
        this.stop();
    }

    private _isStarted: boolean = false;
    private _is_starting: boolean = false;
    private readonly START_FRAME_SIZE: GLM.vec2 = GLM.vec2.fromValues(800, 600);
    public frame_size: GLM.vec2 = this.START_FRAME_SIZE;
    private frame_element: React.RefObject<HTMLCanvasElement | null>;
    private _renderer: IRenderer | null = null;
    private _camera: Camera = new Camera();
    public scene_graph: ISceneGraphComponent = new EmptyScene;
    public lights_configuration: ILightsConfiguration | null = null;
    private mutex = new SharedMutex();

    get isStarted(): boolean {
        return this._isStarted;
    }

    get camera(): Camera {
        return this._camera;
    }

    set camera(value: Camera) {
        if (this.isStarted || this._is_starting)
            throw new Error("Cannot change camera while game is running. First stop the game.");

        this._camera = value;
    }

    get renderer(): IRenderer | null {
        return this._renderer;
    }

    set renderer(renderer: IRenderer) {
        if (this.isStarted || this._is_starting)
            throw new Error("Cannot change renderer while game is running. First stop the game.");

        this._renderer = renderer;
    }

    async start(): Promise<void> {
        await this.mutex.lock();

        if (this.renderer == null || this.frame_element.current == null || this.camera == null || this.scene_graph == null) {
            throw new Error("Rendering not configured.");
        }

        try {
            if (this.isStarted) {
                console.warn("Game is already started.");
                return;
            }

            if (this._is_starting) {
                console.warn("Game is already starting.");
                return;
            }
            this._is_starting = true;

            console.log("Starting rendering engine...");

            if (canInitialize(this.renderer))
                await this.renderer.initialize(this.frame_element.current);

            console.log("Loading scene...");

            if (canInitialize(this.scene_graph))
                await this.scene_graph.initialize(this.frame_element.current);

            this._isStarted = true;
            console.log("Game engine loaded successfully.");
        } catch (e) {
            this._isStarted = false;
            throw e;
        } finally {
            this._is_starting = false;
            this.mutex.release();
        }
    }

    stop(): void {
        if (this._is_starting)
            console.warn("Cannot stop the game while it is starting.");

        this._isStarted = false;
    }

    render() {
        return (<canvas className="game" ref={this.frame_element} onContextMenu={(e) => { e.preventDefault() }} />);
    }

    private renderFrame() {
        if (this.renderer == null || this.frame_element.current == null || this.camera == null || this.scene_graph == null || this.lights_configuration == null) {
            this.stop();
            console.error("Rendering not configured.");
            return;
        }

        this.frame_element.current.width = this.frame_size[0];
        this.frame_element.current.height = this.frame_size[1];

        try {
            this.renderer.useCamera(this.camera);
            this.renderer.setAmbientLightColor(this.lights_configuration.ambient_light_color);
            this.renderer.setDiffuseLight(this.lights_configuration.diffuse_light_position, this.lights_configuration.diffuse_light_color);
            this.renderer.setSpecularLight(this.lights_configuration.specular_light_position);
            
            this.renderer.configureWorldParameters(GLM.vec3.fromValues(0.15, 0.15, 0.15));
            this.renderer.visitSceneComponent(this.scene_graph);
        } catch (e) {
            console.error(e);
            this.stop();
            return;
        }
    }

    public requestRenderingProcess(window: Window): void {
        if (!this.isStarted || this.frame_element.current == null || this.renderer == null) return;

        window.requestAnimationFrame(() => {
            this.renderFrame();
        });
    }
}