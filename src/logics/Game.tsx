import * as GLM from "gl-matrix";
import React from 'react';
import IGame from '../interfaces/IGame';
import IRenderer from '../interfaces/IRenderer';
import Camera from '../models/Camera';
import { ISceneGraphComponent } from '../interfaces/ISceneGraph';
import { EmptyScene } from './SceneGraph';
import { canInitialize } from '../tools/Functions';
import ILightsConfiguration from "../interfaces/ILightsConfiguration";
import Mutex from "./Mutex";

export default class Game extends React.Component implements IGame {
    constructor() {
        super({});
        this.frame_element = React.createRef<HTMLCanvasElement>();
    }

    componentWillUnmount(): void {
        this.stop();
    }

    private _isStarted: boolean = false;
    private game_mutex: Mutex = new Mutex();
    private frame_element: React.RefObject<HTMLCanvasElement | null>;
    private _renderer: IRenderer | null = null;
    private _camera: Camera = new Camera();
    public scene_graph: ISceneGraphComponent = new EmptyScene;
    public lights_configuration: ILightsConfiguration | null = null;

    get isStarted(): boolean {
        return this._isStarted;
    }

    get camera(): Camera {
        return this._camera;
    }

    set camera(value: Camera) {
        if (this.isStarted)
            throw new Error("Cannot change camera while game is running. First stop the game.");

        this._camera = value;
    }

    get renderer(): IRenderer | null {
        return this._renderer;
    }

    set renderer(renderer: IRenderer) {
        if (this.isStarted)
            throw new Error("Cannot change renderer while game is running. First stop the game.");

        this._renderer = renderer;
    }

    async start(): Promise<void> {
        if (this.renderer == null || this.frame_element.current == null || this.camera == null || this.scene_graph == null) {
            throw new Error("Rendering not configured.");
        }

        try {
            await this.game_mutex.lock();
            if (this.isStarted) {
                console.warn("Game is already started.");
                return;
            }

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
            this.game_mutex.release();
        }
    }

    stop(): void {
        this.game_mutex.lock().then(() => {
            this._isStarted = false;
        }).finally(() => {
            this.game_mutex.release();
        });
    }

    render() {
        return (<canvas className="game" ref={this.frame_element} />);
    }

    private renderFrame() {
        if (this.renderer == null || this.frame_element.current == null || this.camera == null || this.scene_graph == null || this.lights_configuration == null) {
            this.stop();
            console.error("Rendering not configured.");
            return;
        }

        //   try {
        this.renderer.configureWorldParameters(GLM.vec3.fromValues(0.2, 0.2, 0.2));
        this.renderer.useCamera(this.camera);
        this.renderer.setAmbientLightColor(this.lights_configuration.ambient_light_color);
        this.renderer.setDiffuseLight(this.lights_configuration.diffuse_light_position, this.lights_configuration.diffuse_light_color);
        this.renderer.setSpecularLight(this.lights_configuration.specular_light_position);

        this.renderer.visitSceneComponent(this.scene_graph);
        /*     } catch (e) {
                 console.error(e);
                 this.stop();
                 return;
             }*/
    }

    public requestRenderingProcess(window: Window): void {
        if (!this.isStarted || this.frame_element.current == null || this.renderer == null) return;

        window.requestAnimationFrame(() => {
            this.renderFrame();
        });
    }
}