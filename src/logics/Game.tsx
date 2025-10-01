import React from 'react';
import IGame from '../interfaces/IGame';
import IRenderer from '../interfaces/IRenderer';
import Camera from '../models/Camera';
import { IInitializable } from '../interfaces/IInitializable';
import { ISceneGraphComponent } from '../interfaces/ISceneGraph';
import { EmptyScene } from './SceneGraph';

export default class Game extends React.Component implements IGame {
    constructor() {
        super({});
        this.frame_element = React.createRef<HTMLCanvasElement>();
    }

    componentWillUnmount(): void {
        this.stop();
    }

    private _isStarted: boolean = false;
    private frame_element: React.RefObject<HTMLCanvasElement | null>;
    private _renderer: IRenderer | null = null;
    private _camera: Camera = new Camera();
    private rendering_timer_handle: number | null = null;
    public scene_graph: ISceneGraphComponent = new EmptyScene;

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

        console.log("Starting rendering engine...");
        const type_checker = (value: any): value is IInitializable<HTMLCanvasElement> => true;

        if (type_checker(this.renderer) && !this.renderer.isInitialized)
            await this.renderer.initialize(this.frame_element.current);

        console.log("Loading scene...");
        if (type_checker(this.scene_graph) && !this.scene_graph.isInitialized)
            await this.scene_graph.initialize(this.frame_element.current);

        this.rendering_timer_handle = window.setInterval(() => this.renderFrame(), 1000 / 60);
        this._isStarted = true;
    }

    stop(): void {
        if (this.rendering_timer_handle != null) {
            window.clearInterval(this.rendering_timer_handle);
            this.rendering_timer_handle = null;
        }
        this._isStarted = false;
    }

    render() {
        return (<canvas className="game" ref={this.frame_element} />);
    }

    private renderFrame() {
        if (this.renderer == null || this.frame_element.current == null || this.camera == null || this.scene_graph == null) {
            this.stop();
            console.error("Rendering not configured.");
            return;
        }

        try {
            this.renderer.configure(this.frame_element.current);
            this.renderer.useCamera(this.camera);
            //TODO lighting

            this.renderer.visitSceneComponent(this.scene_graph);
        } catch (e) {
            console.error(e);
            this.stop();
            return;
        }
    }
}