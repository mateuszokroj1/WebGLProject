import { ISceneGraph } from "../interfaces/ISceneGraph";
import Camera from "./Camera";

export default interface IRenderingContext {
    readonly canvas: HTMLCanvasElement;
    readonly camera: Camera;
    readonly scene_graph: ISceneGraph;
}