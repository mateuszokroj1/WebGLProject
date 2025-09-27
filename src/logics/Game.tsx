import React from 'react'
import IGame from '../interfaces/IGame'
import IRenderer from '../interfaces/IRenderer'
import Camera from '../models/Camera';
import { ISceneGraph } from '../interfaces/ISceneGraph';

export default class Game extends React.Component implements IGame {
    constructor() {
        super({});
        this.frame_element = React.createRef<HTMLCanvasElement>();
    }

    componentWillUnmount(): void {
        this.stop();
    }

    private frame_element: React.RefObject<HTMLCanvasElement | null>;
    private renderer: IRenderer | null = null;
    private camera: Camera = new Camera();
    private rendering_timer_handle: number | null = null;
    private scene_graph: ISceneGraph | null = null;

    assignCamera(camera: Camera): void {
        this.camera = camera;
    }

    assignRenderer(renderer: IRenderer): void {
        this.renderer = renderer;
    }

    start(): void {
        if (this.renderer == null || this.frame_element.current == null || this.camera == null || this.scene_graph == null) {
            throw new Error("Rendering not configured.");
        }

        this.rendering_timer_handle = window.setInterval(() => this.renderFrame(), 1000 / 60);
    }

    stop(): void {
        if(this.rendering_timer_handle != null) {
            window.clearInterval(this.rendering_timer_handle);
            this.rendering_timer_handle = null;
        }
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
            this.renderer.render({canvas: this.frame_element.current, camera: this.camera, scene_graph: this.scene_graph});
        } catch (e) {
            console.error(e);
            this.stop();
            return;
        }
    }
}